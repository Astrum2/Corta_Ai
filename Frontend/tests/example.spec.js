// @ts-check
import { test, expect } from '@playwright/test';

test('login tem sucesso e redireciona para a home', async ({ page }) => {
  await page.route('http://localhost:3001/login', async (route) => {
    await route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake.jwt.token'})});
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

test('cadastro tem sucesso e redireciona para a home', async ({ page }) => {
  await page.route('http://localhost:3001/users', async (route) => {
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({}) });
  });
  await page.route('http://localhost:3001/login', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake.jwt.token' })});
  });

  await page.goto('http://localhost:3000/#/Cadastro');

  await page.getByLabel('Nome:').fill('Usuário Teste');
  await page.getByLabel('Email:').fill('usuario.test@example.com');
  await page.getByLabel('Senha:').nth(0).fill('Abc123#');
  await page.getByLabel('Confirmar Senha:').fill('Abc123#');
  await page.getByLabel('CPF:').fill('923.332.930-55');
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(page.getByRole('alert')).toHaveText('Cadastro realizado com sucesso!');
  await expect(page).toHaveURL('http://localhost:3000/#/');
});

test('cadastro falha e mostra mensagem de erro', async ({ page }) => {
  await page.route('http://localhost:3001/users', async (route) => {
    await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'Email já cadastrado' }) });
  });

  await page.goto('http://localhost:3000/#/Cadastro');

  await page.getByLabel('Nome:').fill('Usuário Teste');
  await page.getByLabel('Email:').fill('usuario.test@example.com');
  await page.getByLabel('Senha:').nth(0).fill('Abc123#');
  await page.getByLabel('Confirmar Senha:').fill('Abc123#');
  await page.getByLabel('CPF:').fill('923.332.930-55');
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(page.getByRole('alert')).toHaveText('Email já cadastrado');
  await expect(page).toHaveURL('http://localhost:3000/#/Cadastro');
});