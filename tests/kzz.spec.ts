import { test, expect } from '@playwright/test';
import { NewBitableRecords, execute, JisiluRecord, makeFields } from '../utils/jisilu';

test('test', async ({ page, request }) => {

  console.log('手机号/用户名', process.env.JSL_ACCOUNT);
  console.log('密码', process.env.JSL_SECRET);
  console.log('app_id', process.env.app_id);
  console.log('app_secret', process.env.app_secret);
  console.log('app_token', process.env.app_token);
  console.log('table_id', process.env.table_id);

  await page.goto('https://www.jisilu.cn/data/cbnew/#cb');

  await page.getByRole('button', { name: '登录' }).click();
  await expect(page).toHaveURL('https://www.jisilu.cn/account/login/');

  await page.getByPlaceholder('手机号/用户名').click();

  console.log(4444, page.getByPlaceholder('手机号/用户名'));
  console.log(5555, await page.getByPlaceholder('手机号/用户名'));


  await page.getByPlaceholder('手机号/用户名').fill(process.env.JSL_ACCOUNT || '');

  await page.getByPlaceholder('密码').click();

  await page.getByPlaceholder('密码').fill(process.env.JSL_SECRET || '');

  const aaa = page.locator('form:has-text("帐号密码登录 忘记密码 记住我 本人已阅读并同意《用户协议》和《隐私政策》 登录") input[type="checkbox"]');

  console.log(3333, aaa.nth(1));

  await page.locator('form:has-text("帐号密码登录 忘记密码 记住我 本人已阅读并同意《用户协议》和《隐私政策》 登录") input[type="checkbox"]').nth(1).check();

  await page.getByRole('button', { name: '登录', exact: true }).click();

  page.on('response', (response) => {
    // console.log(111111, response);
    if (response.url().includes('/data/cbnew/cb_list_new')) {
      response.json().then((res) => {
        const records: NewBitableRecords = [];

        res.rows.forEach((row) => {
          const rowArr = Object.values(row);
          const rowData = rowArr[1] as JisiluRecord;
          records.push({
            fields: makeFields(rowData),
          });
        });

        execute(request, {
          app_token: process.env.app_token || '',
          table_id: process.env.table_id || '',
          records,
        });
      });
    }
  });

  await expect(page).toHaveURL('https://www.jisilu.cn/data/cbnew/#cb');
  
  await page.waitForLoadState('networkidle');

  await page.waitForTimeout(5000);
});
