const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'./tests/browser',workers:1,timeout:60000,
  use:{browserName:'chromium',channel:process.env.PLAYWRIGHT_CHANNEL||undefined},
  webServer:{command:'python run_demo.py --no-build --user-port 18080',url:'http://127.0.0.1:5173',timeout:150000,reuseExistingServer:false}
});
