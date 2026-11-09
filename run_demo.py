"""Build and run the complete loopback-only parking portfolio demo."""
from pathlib import Path
from urllib.request import urlopen
from urllib.error import URLError
import argparse
import os
import shutil
import socket
import subprocess
import sys
import time

ROOT=Path(__file__).resolve().parent
FLAGS=subprocess.CREATE_NO_WINDOW if os.name=='nt' else 0

def ready(port, process, timeout=120):
    deadline=time.monotonic()+timeout
    while time.monotonic()<deadline:
        if process.poll() is not None:
            raise RuntimeError(f'Service on port {port} exited; see .demo/logs')
        try:
            with socket.create_connection(('127.0.0.1',port),timeout=.5):
                return
        except OSError:
            time.sleep(.25)
    raise RuntimeError(f'Timed out waiting for port {port}; see .demo/logs')

def build():
    for project in ['parking_admin','user-backend']:
        wrapper=str(ROOT/project/('mvnw.cmd' if os.name=='nt' else 'mvnw'))
        if os.name!='nt':
            os.chmod(wrapper,0o755)
        subprocess.run([wrapper,'-q','-DskipTests','package'],cwd=ROOT/project,check=True)
    for project in ['parking-admin-frontend','user-frontend']:
        subprocess.run([shutil.which('npm.cmd' if os.name=='nt' else 'npm'),'ci'],cwd=ROOT/project,check=True)

class Demo:
    def __init__(self,data_dir=None,db_port=9123,admin_port=8081,user_port=8080,frontends=True):
        self.data=Path(data_dir or ROOT/'.demo').resolve()
        self.ports=(db_port,admin_port,user_port)
        self.frontends=frontends
        self.processes=[]
        self.logs=[]

    def start(self):
        java=shutil.which('java')
        if not java:
            raise RuntimeError('Install JDK 21 and add java to PATH.')
        for port in [*self.ports,*([3001,5173] if self.frontends else [])]:
            with socket.socket() as check:
                check.bind(('127.0.0.1',port))
        (self.data/'logs').mkdir(parents=True,exist_ok=True)
        h2=Path.home()/'.m2/repository/com/h2database/h2/2.2.224/h2-2.2.224.jar'
        if not h2.exists():
            raise RuntimeError('Build first: python run_demo.py')
        db,admin,user=self.ports
        self.spawn('database',[java,'-Dh2.bindAddress=127.0.0.1','-cp',str(h2),'org.h2.tools.Server','-tcp','-tcpPort',str(db),'-ifNotExists','-baseDir',str(self.data)])
        ready(db,self.processes[-1])
        env=dict(os.environ,DEMO_DATABASE_URL=f'jdbc:h2:tcp://localhost:{db}/parking;MODE=MySQL;DATABASE_TO_LOWER=TRUE')
        # Start the admin schema first, then add customer tables and sample data.
        for project,port in [('parking_admin',admin),('user-backend',user)]:
            jars=[p for p in (ROOT/project/'target').glob('*.jar') if not p.name.endswith('.original')]
            if len(jars)!=1:
                raise RuntimeError(f'Build {project} first')
            self.spawn(project,[java,'-jar',str(jars[0]),'--spring.profiles.active=demo',f'--server.port={port}'],env=env,cwd=ROOT/project)
            ready(port,self.processes[-1])
            # A bound Spring port precedes CommandLineRunner completion.
            if project=='user-backend':
                deadline=time.monotonic()+30
                while time.monotonic()<deadline:
                    try:
                        with urlopen(f'http://127.0.0.1:{port}/api/parking/buildings',timeout=2) as response:
                            if b'Demo Garage' in response.read():
                                break
                    except URLError:
                        pass
                    time.sleep(.25)
        if self.frontends:
            for project,port in [('parking-admin-frontend',3001),('user-frontend',5173)]:
                frontend_env=dict(os.environ,VITE_USER_API_TARGET=f'http://127.0.0.1:{user}',VITE_ADMIN_API_TARGET=f'http://127.0.0.1:{admin}')
                self.spawn(project,[shutil.which('node'),str(ROOT/project/'node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port',str(port),'--strictPort'],cwd=ROOT/project,env=frontend_env)
                ready(port,self.processes[-1])
        return self

    def spawn(self,name,command,cwd=ROOT,env=None):
        log=(self.data/'logs'/f'{name}.log').open('w',encoding='utf-8')
        self.logs.append(log)
        self.processes.append(subprocess.Popen(command,cwd=cwd,env=env,stdout=log,stderr=subprocess.STDOUT,creationflags=FLAGS))

    def close(self):
        for process in reversed(self.processes):
            if process.poll() is None:
                process.terminate()
            try:
                process.wait(timeout=15)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()
        for log in self.logs:
            log.close()

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--no-build',action='store_true')
    parser.add_argument('--user-port',type=int,default=8080)
    args=parser.parse_args()
    if not args.no_build:
        build()
    demo=Demo(user_port=args.user_port)
    try:
        demo.start()
        print('Customer: http://127.0.0.1:5173 | Admin: http://127.0.0.1:3001',flush=True)
        print('Local demo admin: admin / DemoAdmin123! | Ctrl+C stops all owned services.',flush=True)
        while all(process.poll() is None for process in demo.processes):
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        demo.close()

if __name__=='__main__':
    main()
