-- CreateTable
CREATE TABLE "vendas" (
    "id" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "vendedor" TEXT NOT NULL,
    "produto" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valor_unitario" DECIMAL(10,2) NOT NULL,
    "valor_total" DECIMAL(10,2) NOT NULL,
    "cliente" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receitas_outras" (
    "id" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'previsto',
    "responsavel" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receitas_outras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despesas" (
    "id" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "fornecedor" TEXT,
    "valor" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "forma_pagamento" TEXT,
    "responsavel" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "despesas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "referencia" DATE,
    "valor_meta" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "metas_pkey" PRIMARY KEY ("id")
);
