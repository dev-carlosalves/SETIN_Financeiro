const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS vendas (
        id SERIAL PRIMARY KEY,
        data DATE NOT NULL,
        vendedor TEXT NOT NULL,
        produto TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        valor_unitario DECIMAL(10,2) NOT NULL,
        valor_total DECIMAL(10,2) NOT NULL,
        cliente TEXT,
        equipe INTEGER NOT NULL DEFAULT 1,
        forma_pagamento TEXT NOT NULL DEFAULT 'dinheiro',
        criado_em TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('✓ tabela vendas criada');

    await sql`ALTER TABLE vendas ADD COLUMN IF NOT EXISTS equipe INTEGER NOT NULL DEFAULT 1`;
    await sql`ALTER TABLE vendas ADD COLUMN IF NOT EXISTS forma_pagamento TEXT NOT NULL DEFAULT 'dinheiro'`;
    console.log('✓ colunas equipe e forma_pagamento verificadas na tabela vendas');

    await sql`
      CREATE TABLE IF NOT EXISTS receitas_outras (
        id SERIAL PRIMARY KEY,
        data DATE NOT NULL,
        tipo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'previsto',
        responsavel TEXT NOT NULL,
        criado_em TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('✓ tabela receitas_outras criada');

    await sql`
      CREATE TABLE IF NOT EXISTS despesas (
        id SERIAL PRIMARY KEY,
        data DATE NOT NULL,
        categoria TEXT NOT NULL,
        descricao TEXT NOT NULL,
        fornecedor TEXT,
        valor DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendente',
        forma_pagamento TEXT,
        responsavel TEXT NOT NULL,
        criado_em TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('✓ tabela despesas criada');

    await sql`
      CREATE TABLE IF NOT EXISTS metas (
        id SERIAL PRIMARY KEY,
        tipo TEXT NOT NULL,
        referencia DATE,
        valor_meta DECIMAL(10,2) NOT NULL
      )
    `;
    console.log('✓ tabela metas criada');

    console.log('\n🎉 Migração concluída com sucesso!');
  } catch(e) {
    console.error('ERRO:', e.message);
    process.exit(1);
  }
}

migrate();
