"""Exercise both real Java services against one disposable shared database."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import json
import socket
import sys
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from run_demo import Demo

def port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1',0))
        return sock.getsockname()[1]

class DemoWorkflow(unittest.TestCase):
    def test_shared_parking_workflow(self):
        with TemporaryDirectory(prefix='parking-check-') as folder:
            demo=Demo(folder,port(),port(),port(),frontends=False)
            try:
                demo.start()
                _,admin,user=demo.ports
                def request(service,path,body=None):
                    req=Request(f'http://127.0.0.1:{service}'+path,
                                data=None if body is None else json.dumps(body).encode(),
                                headers={'Content-Type':'application/json'})
                    try:
                        response=urlopen(req,timeout=10)
                    except HTTPError as error:
                        response=error
                    with response:
                        raw=response.read()
                        return response.status,json.loads(raw) if raw else None
                self.assertEqual(request(admin,'/api/login',{'username':'admin','password':'wrong'})[0],401)
                self.assertEqual(request(admin,'/api/login',{'username':'admin','password':'DemoAdmin123!'})[0],200)
                account={'username':'demo-customer','password':'DemoPass123!','fullName':'Demo Customer','email':'customer@example.test'}
                status,created=request(user,'/api/auth/register',account)
                self.assertEqual(status,200,created)
                self.assertNotIn('password',created)
                self.assertEqual(request(user,'/api/auth/register',account)[0],409)
                self.assertEqual(request(user,'/api/auth/login',account)[0],200)
                status,buildings=request(user,'/api/parking/buildings')
                self.assertEqual(status,200)
                _,slots=request(user,f'/api/parking/slots?buildingId={buildings[0]["id"]}')
                self.assertEqual(len(slots),30)
                booking={'userId':created['id'],'slotId':slots[0]['id'],'carNumber':'aa-1234'}
                status,active=request(user,'/api/parking/park',booking)
                self.assertEqual(status,200,active)
                self.assertEqual(active['carNumber'],'AA-1234')
                self.assertEqual(request(user,'/api/parking/park',booking)[0],409)
                _,status_rows=request(user,f'/api/parking/status?userId={created["id"]}')
                self.assertEqual(len(status_rows),1)
                key={'userId':created['id'],'slotId':slots[0]['id'],'key':active['key']}
                self.assertEqual(request(user,'/api/parking/verify-key',key)[0],200)
                status,receipt=request(user,'/api/parking/payment/checkout',{'parkedId':active['parkedId']})
                self.assertEqual(status,200,receipt)
                self.assertEqual(float(receipt['fee']),0)
                _,history=request(user,f'/api/parking/history?userId={created["id"]}')
                self.assertEqual(len(history),1)
                _,available=request(user,f'/api/parking/slots?buildingId={buildings[0]["id"]}')
                self.assertFalse(next(slot for slot in available if slot['id']==slots[0]['id'])['occupied'])
                # Admin sees the same buildings after a customer completes parking.
                self.assertEqual(request(admin,'/api/buildings')[1][0]['name'],buildings[0]['name'])
            except BaseException:
                for log in (Path(folder)/'logs').glob('*.log'):
                    print(log.name,log.read_text(encoding='utf-8',errors='replace')[-7000:])
                raise
            finally:
                demo.close()

if __name__=='__main__':
    unittest.main()
