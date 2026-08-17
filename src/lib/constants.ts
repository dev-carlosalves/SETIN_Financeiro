// Lista de produtos para vendas
export const PRODUTOS: string[] = [
  'Café',
  'Sanduíche',
  'Outro',
]

// Tipos de receita
export const TIPOS_RECEITA = [
  { value: 'patrocinio', label: 'Patrocínio' },
  { value: 'inscricao', label: 'Inscrição' },
  { value: 'doacao', label: 'Doação' },
  { value: 'outro', label: 'Outro' },
] as const

// Formas de pagamento
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
