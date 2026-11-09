const {test,expect}=require('@playwright/test');
test('customer registers and signs into shared garage',async({page})=>{
  await page.goto('http://127.0.0.1:5173/register');
  const name='browser'+Date.now();
  for(const [field,value] of Object.entries({username:name,fullName:'Browser Customer',email:name+'@example.test',password:'DemoPass123!'}))
    await page.locator(`[name="${field}"]`).fill(value);
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/login/);
  await page.locator('input').nth(0).fill(name);
  await page.locator('input[type=password]').fill('DemoPass123!');
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('option',{name:'Demo Garage'})).toHaveCount(1);
});
test('administrator signs in against database',async({page})=>{
  await page.goto('http://127.0.0.1:3001');
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').fill('DemoAdmin123!');
  await page.locator('button').click();
  await expect(page.getByRole('link',{name:/dashboard/i})).toBeVisible();
});
