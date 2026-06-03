// @ts-check
import { test, expect } from '@playwright/test';

test('login tem sucesso e redireciona para a home', async ({ page }) => {
  await page.route('http://localhost:3001/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'fake.jwt.token'
      }),
    });
  });

  await page.goto('http://localhost:3000/#/Login');

  await page.getByLabel('Email:').fill('adminteste@gmail.com');
  await page.getByLabel('Senha:').fill('Abc123#');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByRole('alert')).toHaveText('Login realizado com sucesso!');
  await expect(page).toHaveURL('http://localhost:3000/#/');
});

test('login falha e mostra mensagem de erro', async ({ page }) => {
  await page.route('http://localhost:3001/login', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Email ou senha inválidos'
      }),
    });
  });

  await page.goto('http://localhost:3000/#/Login');

  await page.getByLabel('Email:').fill('adminteste@gmail.com');
  await page.getByLabel('Senha:').fill('senha-errada');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByRole('alert')).toHaveText('Email ou senha inválidos');
  await expect(page).toHaveURL('http://localhost:3000/#/Login');
});