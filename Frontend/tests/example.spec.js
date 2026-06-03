// @ts-check
import { test, expect } from '@playwright/test';

/**
 * @typedef {{ id: number, name: string, description?: string, duration_minutes?: number, price?: number }} ServiceFixture
 * @typedef {{ nextCreatedId?: number }} ServicesRouteState
 */

/**
 * @param {import('@playwright/test').Page} page
 * @param {ServiceFixture[]} initialServices
 * @param {ServicesRouteState} [routeState]
 */
async function prepareAdminServicesPage(page, initialServices, routeState = {}) {
  const servicesState = {
    ...routeState,
    services: [...initialServices],
  };

  await page.addInitScript((data) => {
    const { loggedUser } = data;
    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
  }, {
    loggedUser: {
      id: 1,
      nome: 'Admin Teste',
      email: 'admin@teste.com',
      token: 'fake.admin.token',
      admin: true,
    },
  });

  await page.route('http://localhost:3001/services', async (route) => {
    const request = route.request();

    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(servicesState.services),
      });
      return;
    }

    if (request.method() === 'POST') {
      const payload = request.postDataJSON();
      const createdService = {
        id: routeState.nextCreatedId ?? 2,
        ...payload,
      };

      servicesState.services = [...servicesState.services, createdService];

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(createdService),
      });
      return;
    }

    await route.fallback();
  });

  await page.route('http://localhost:3001/services/*', async (route) => {
    const request = route.request();
    const serviceId = Number(request.url().split('/').pop());

    if (request.method() === 'PUT') {
      const payload = request.postDataJSON();

      servicesState.services = servicesState.services.map((service) => (
        service.id === serviceId
          ? { ...service, ...payload }
          : service
      ));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: serviceId, ...payload }),
      });
      return;
    }

    if (request.method() === 'DELETE') {
      servicesState.services = servicesState.services.filter((service) => service.id !== serviceId);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
      return;
    }

    await route.fallback();
  });

  return servicesState;
}

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

test('serviço faz CRUD completo com sucesso', async ({ page }) => {
  const servicesState = await prepareAdminServicesPage(page, [
    { id: 1, name: 'Corte Tradicional', description: 'Corte simples e acabamento clássico', duration_minutes: 30, price: 25 },
  ], { nextCreatedId: 2 });

  await page.goto('http://localhost:3000/#/Serviços');

  await expect(page.getByRole('heading', { name: 'Nossos Servicos' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Corte Tradicional' })).toBeVisible();

  await page.getByRole('button', { name: 'Novo Serviço' }).click();
  await page.getByPlaceholder('Nome do serviço').fill('Barba Premium');
  await page.getByPlaceholder('Descrição').fill('Barba feita com acabamento premium');
  await page.getByPlaceholder('Duração (minutos)').fill('45');
  await page.getByPlaceholder('Preço').fill('55');
  await page.getByRole('button', { name: 'Criar Serviço' }).click();

  await expect(page.getByRole('alert')).toHaveText('Serviço criado com sucesso!');
  await expect(page.getByRole('heading', { name: 'Barba Premium' })).toBeVisible();

  await page.getByRole('button', { name: /Editar/ }).last().click();
  await page.getByPlaceholder('Nome').fill('Barba Premium Atualizado');
  await page.getByPlaceholder('Descrição').fill('Barba com acabamento atualizado');
  await page.getByPlaceholder('Duração (minutos)').fill('50');
  await page.getByPlaceholder('Preço').fill('60');
  await page.getByRole('button', { name: 'Salvar' }).click();

  await expect(page.getByRole('alert')).toHaveText('Serviço atualizado com sucesso!');
  await expect(page.getByRole('heading', { name: 'Barba Premium Atualizado' })).toBeVisible();

  await page.locator('.servico-card').filter({ has: page.getByRole('heading', { name: 'Barba Premium Atualizado' }) }).getByRole('button', { name: '🗑️ Deletar' }).click();
  await expect(page.getByRole('heading', { name: 'Confirmar exclusão' })).toBeVisible();
  await page.getByRole('button', { name: 'Deletar', exact: true }).click();

  await expect(page.getByRole('alert')).toHaveText('Serviço deletado com sucesso!');
  await expect(page.getByRole('heading', { name: 'Barba Premium Atualizado' })).toHaveCount(0);

  expect(servicesState.services).toEqual([
    { id: 1, name: 'Corte Tradicional', description: 'Corte simples e acabamento clássico', duration_minutes: 30, price: 25},
  ]);
});

test('criação de serviço falha e mostra mensagem de erro', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('loggedUser', JSON.stringify({
      id: 1,
      nome: 'Admin Teste',
      email: 'admin@teste.com',
      token: 'fake.admin.token',
      admin: true,
    }));
  });

  await page.route('http://localhost:3001/services', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Corte Tradicional', description: 'Corte simples e acabamento clássico', duration_minutes: 30, price: 25 },
        ]),
      });
      return;
    }

    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'Nao foi possivel criar o servico' }) });
      return;
    }

    await route.fallback();
  });

  await page.goto('http://localhost:3000/#/Serviços');

  await page.getByRole('button', { name: 'Novo Serviço' }).click();
  await page.getByPlaceholder('Nome do serviço').fill('Barba Premium');
  await page.getByPlaceholder('Descrição').fill('Barba feita com acabamento premium');
  await page.getByPlaceholder('Duração (minutos)').fill('45');
  await page.getByPlaceholder('Preço').fill('55');
  await page.getByRole('button', { name: 'Criar Serviço' }).click();

  await expect(page.getByRole('alert')).toHaveText('Nao foi possivel criar o servico');
  await expect(page.getByRole('heading', { name: 'Barba Premium' })).toHaveCount(0);
});