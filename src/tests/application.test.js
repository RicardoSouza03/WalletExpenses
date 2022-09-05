import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWith';
import App from '../App';
import mockData from './mockData';

describe('Tests application functionalities', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });
  });

  it('Expects to have three elements in login screen', () => {
    renderWithRouterAndRedux(<App />);
    expect(screen.getByPlaceholderText(/senha/i)).toBeDefined();
    expect(screen.getByRole('textbox', { type: 'email' })).toBeDefined();
    expect(screen.getByRole('button', { name: /entrar/i, type: 'button' })).toBeDefined();
  });

  it('Expects button to only be enabled if conditions are true', () => {
    renderWithRouterAndRedux(<App />);
    const invalidEmail = 'invalidEmail.com';
    const validEmail = 'valid@email.com';
    const password = '123456';

    const emailInput = screen.getByRole('textbox', { type: 'email' });
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    const submitBtn = screen.getByRole('button', { name: /entrar/i, type: 'button' });
    expect(submitBtn).toBeDefined();
    expect(submitBtn).toBeDisabled(true);

    // testing with invalid email and valid password
    userEvent.type(emailInput, invalidEmail);
    expect(emailInput).toHaveValue(invalidEmail);
    expect(submitBtn).toBeDisabled(true);

    userEvent.type(passwordInput, password);
    expect(passwordInput).toHaveValue(password);
    expect(submitBtn).toBeDisabled(true);

    userEvent.clear(emailInput);
    userEvent.clear(passwordInput);

    // testing with valid email and valid password
    userEvent.type(emailInput, validEmail);
    expect(emailInput).toHaveValue(validEmail);
    expect(submitBtn).toBeDisabled(true);

    userEvent.type(passwordInput, password);
    expect(passwordInput).toHaveValue(password);
    expect(submitBtn).toBeEnabled(true);
  });

  it('Expects to be redirect do "/carteira", when login is completed', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    expect(screen.getByRole('textbox', { type: 'email' })).toBeDefined();
    expect(screen.getByPlaceholderText(/senha/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /entrar/i, type: 'button' })).toBeDefined();

    userEvent.type(screen.getByRole('textbox', { type: 'email' }), 'algum@email.com');
    userEvent.type(screen.getByPlaceholderText(/senha/i), '123456');
    userEvent.click(screen.getByRole('button', { name: /entrar/i, type: 'button' }));

    const { location: { pathname } } = history;
    expect(pathname).toBe('/carteira');

    expect(screen.getByRole('button', { name: /adicionar despesa/i, type: 'submit' })).toBeDefined();
  });

  it('Expects store to have email provided in Login screen', () => {
    renderWithRouterAndRedux(
      <App />,
      { initialEntries: ['/carteira'],
        initialState: {
          user: {
            email: 'email@email.com',
          },
        },
      },
    );

    expect(screen.getByRole('heading', { level: 2, name: /@email.com/i })).toBeDefined();
  });

  it('Expects forms to have rigth elements', () => {
    renderWithRouterAndRedux(
      <App />,
      { initialEntries: ['/carteira'],
        initialState: {
          user: {
            email: 'algum@email.com',
          },
          wallet: {
            currencies: Object.keys(mockData).filter((key) => key !== 'USDT'),
            expensesTotalValue: 0,
          },
        },
      },
    );

    const inputDescription = screen.getByRole('textbox', { type: 'text' });
    const inputValue = screen.getByRole('spinbutton');
    const selectInputs = screen.getAllByRole('option');

    expect(selectInputs).toHaveLength(Object.keys(mockData).length + 7);
    expect(inputDescription).toBeDefined();
    expect(inputValue).toBeDefined();
  });

  it('Expect forms to work properly', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'],
      initialState: {
        wallet: {
          currencies: Object.keys(mockData).filter((key) => key !== 'USDT'),
          expensesTotalValue: 0,
        },
      } });

    const inputDescription = screen.getByRole('textbox', { type: 'text' });
    const inputValue = screen.getByRole('spinbutton');

    userEvent.type(inputDescription, 'algo bom');
    userEvent.type(inputValue, '20');

    expect(inputDescription).toHaveValue('algo bom');
    expect(inputValue).toHaveValue(20);

    // teste de referência de como realizar teste em select element
    // https://cathalmacdonnacha.com/how-to-test-a-select-element-with-react-testing-library
    userEvent.selectOptions(
      screen.getAllByRole('combobox')[0],
      screen.getByRole('option', { name: /btc/i }),
    );
    expect(screen.getByRole('option', { name: /btc/i }).selected).toBe(true);

    userEvent.selectOptions(
      screen.getAllByRole('combobox')[1],
      screen.getByRole('option', { name: /crédito/i }),
    );
    expect(screen.getByRole('option', { name: /crédito/i }).selected).toBe(true);

    userEvent.selectOptions(
      screen.getAllByRole('combobox')[2],
      screen.getByRole('option', { name: /lazer/i }),
    );
    expect(screen.getByRole('option', { name: /lazer/i }).selected).toBe(true);
  });

  it('Expect that update user total expenses', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });

    const inputDescription = screen.getByRole('textbox', { type: 'text' });
    const inputValue = screen.getByRole('spinbutton');
    const submitBtn = screen.getByRole('button', { name: /adicionar/i });

    userEvent.type(inputDescription, 'algo interessante');
    userEvent.type(inputValue, '20');
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('95.06');
    });
  });

  it('Expect that exists an table header in wallet with certain items', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });

    const tableHeaderElements = [
      'Descrição',
      'Tag',
      'Método de pagamento',
      'Valor',
      'Moeda',
      'Câmbio utilizado',
      'Valor convertido',
      'Moeda de conversão',
      'Editar/Excluir',
    ];
    const columHeaders = screen.getAllByRole('columnheader');
    columHeaders.forEach((headerElement) => {
      const checkIfHasElement = tableHeaderElements
        .some((element) => element === headerElement.innerHTML);
      expect(checkIfHasElement).toBe(true);
    });
  });

  it('Expect that when added an expense, it appears in the table', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });

    const inputDescription = screen.getByRole('textbox', { type: 'text' });
    const inputValue = screen.getByRole('spinbutton');
    const submitBtn = screen.getByRole('button', { name: /adicionar/i });

    userEvent.type(inputDescription, 'algo bom');
    userEvent.type(inputValue, '20');

    expect(inputDescription).toHaveValue('algo bom');
    expect(inputValue).toHaveValue(20);
    expect(submitBtn).toBeDefined();

    userEvent.click(submitBtn);

    await waitFor(() => {
      const allRows = screen.getAllByRole('row');

      expect(allRows[1]).toHaveTextContent(/algo bom/i);
      expect(allRows[1]).toHaveTextContent(/20/i);
    });
  });

  it('Expect that when clicked to remove an item it does not exists anymore', async () => {
    const expense = {
      id: 0,
      value: '29',
      description: 'algo novo',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Lazer',
      exchangeRates: mockData,
    };
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'],
      initialState: {
        wallet: {
          currencies: Object.keys(mockData).filter((key) => key !== 'USDT'),
          expenses: [expense],
          expensesTotalValue: 150.84,
        },
      } });

    const allRows = screen.getAllByRole('row');

    expect(allRows[1]).toHaveTextContent(/algo novo/i);
    expect(allRows[1]).toHaveTextContent(/29/i);

    const deleteBtn = screen.getByRole('button', { name: /Excluir/i });
    expect(deleteBtn).toBeDefined();
    userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(1);
    });
  });

  it('Expect that when clicked to edit an item it can be edited', async () => {
    const expenseOne = {
      id: 0,
      value: '20',
      description: 'algo muito legal',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Trabalho',
      exchangeRates: mockData,
    };

    const expenseTwo = {
      id: 1,
      value: '20',
      description: 'lanche',
      currency: 'EUR',
      method: 'Dinheiro',
      tag: 'Lazer',
      exchangeRates: mockData,
    };
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'],
      initialState: {
        wallet: {
          currencies: Object.keys(mockData).filter((key) => key !== 'USDT'),
          expenses: [expenseOne, expenseTwo],
          expensesTotalValue: 190.12,
        },
      } });

    expect(screen.getAllByRole('row')).toHaveLength(3);

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    userEvent.click(editButtons[1]);

    await waitFor(() => {
      const inputDescription = screen.getByRole('textbox', { type: 'text' });
      const inputValue = screen.getByRole('spinbutton');

      const submitBtn = screen.getAllByRole('button')[0];
      expect(submitBtn).toHaveTextContent(/editar despesa/i);

      expect(inputDescription).toHaveValue('lanche');
      expect(inputValue).toHaveValue(20);
    });
  });

  it('Expect that an item can be edited properly', async () => {
    const expenseOne = {
      id: 0,
      value: '20',
      description: 'algo legal',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
      exchangeRates: mockData,
    };

    const expenseTwo = {
      id: 1,
      value: '20',
      description: 'lanche',
      currency: 'EUR',
      method: 'Dinheiro',
      tag: 'Lazer',
      exchangeRates: mockData,
    };
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'],
      initialState: {
        wallet: {
          currencies: Object.keys(mockData).filter((key) => key !== 'USDT'),
          expenses: [expenseOne, expenseTwo],
          expensesTotalValue: 190.12,
          editor: true,
          idToEdit: 1,
          formStatus: 1,
        },
      } });

    expect(screen.getAllByRole('row')).toHaveLength(3);
    const buttons = screen.getAllByRole('button', { name: /editar/i });
    userEvent.click(buttons[2]);

    const inputValue = screen.getByRole('spinbutton');
    expect(inputValue).toHaveValue(20);

    userEvent.selectOptions(
      screen.getAllByRole('combobox')[0],
      screen.getByRole('option', { name: /btc/i }),
    );
    expect(screen.getByRole('option', { name: /btc/i }).selected).toBe(true);
    userEvent.click(buttons[0]);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('3039.76');
      expect(screen.getAllByRole('row')).toHaveLength(3);
      expect(screen.getAllByRole('row')[2]).toHaveTextContent(/bitcoin/i);
    });
  });

  it('Expects that error message appears when API is not responding', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockRejectedValue('erro na requisição'),
    });

    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('erro na requisição')).toBeDefined();
  });

  it('Tests if throws error when addin an expense and API isnt working', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });

    const inputDescription = screen.getByRole('textbox', { type: 'text' });
    const inputValue = screen.getByRole('spinbutton');
    const submitBtn = screen.getByRole('button', { name: /adicionar/i });

    userEvent.type(inputDescription, 'algo bom');
    userEvent.type(inputValue, '20');

    expect(inputDescription).toHaveValue('algo bom');
    expect(inputValue).toHaveValue(20);
    expect(submitBtn).toBeDefined();
    userEvent.click(submitBtn);

    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockRejectedValue('erro ao fazer a requisição'),
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(screen.findByText('erro ao fazer a requisição')).toBeDefined();
  });
});
