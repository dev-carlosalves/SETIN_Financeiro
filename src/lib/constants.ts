// Lista de produtos para vendas com preço fixo
export const PRODUTOS = [
  { nome: 'Misto quente', preco: 4.00 },
  { nome: 'Pão com queijo', preco: 3.50 },
  { nome: 'Café 150ml sem leite', preco: 1.50 },
  { nome: 'Café 200ml sem leite', preco: 2.00 },
  { nome: 'Café 250ml sem leite', preco: 2.50 },
  { nome: 'Café 300ml sem leite', preco: 3.00 },
  { nome: 'Café 300ml com leite', preco: 3.50 },
] as const

// Formas de pagamento para vendas de produtos
export const FORMAS_PAGAMENTO_VENDA = [
  { value: 'pix', label: 'Pix' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'cartao', label: 'Cartão' },
] as const

// Equipes disponíveis
export const EQUIPES = [1, 2, 3, 4] as const

// Tipos de receita
export const TIPOS_RECEITA = [
  { value: 'patrocinio', label: 'Patrocínio' },
  { value: 'brinde', label: 'Brinde' },
  { value: 'inscricao', label: 'Inscrição' },
  { value: 'doacao', label: 'Doação' },
  { value: 'outro', label: 'Outro' },
] as const

// Formas de pagamento (despesas)
export const FORMAS_PAGAMENTO = [
  'Pix',
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Boleto',
  'Transferência',
] as const

// Status de despesa
export const STATUS_DESPESA = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'pago', label: 'Pago' },
] as const

// Status de receita
export const STATUS_RECEITA = [
  { value: 'previsto', label: 'Previsto' },
  { value: 'recebido', label: 'Recebido' },
] as const
