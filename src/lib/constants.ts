// Lista de produtos para vendas
export const PRODUTOS: string[] = [
  'Camiseta',
  'Ingresso avulso',
  'Copo personalizado',
  'Kit SETIN',
  'Caneca',
  'Adesivo',
  'Livro/Apostila',
  'Outro',
]

// Lista de categorias de despesa
export const CATEGORIAS_DESPESA: string[] = [
  'Espaço/aluguel',
  'Alimentação',
  'Material gráfico',
  'Transporte',
  'Brindes/premiação',
  'Tecnologia',
  'Comunicação/Marketing',
  'Segurança',
  'Limpeza',
  'Outros',
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
  'Cartão',
  'Boleto',
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
