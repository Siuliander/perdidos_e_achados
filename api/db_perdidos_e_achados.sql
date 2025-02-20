-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS db_Perdidos_e_Achados;

-- Selecionar o banco de dados criado
USE db_Perdidos_e_Achados;

-- Tabela Usuário
CREATE TABLE IF NOT EXISTS tb_usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    identidade VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NULL,
    data_usuario DATETIME NOT NULL DEFAULT NOW(),
    status TINYINT(1) DEFAULT 1
);

-- Tabela Categoria
CREATE TABLE IF NOT EXISTS tb_categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL UNIQUE,
    status TINYINT(1) DEFAULT 1
);

insert into tb_categoria (categoria) values('documentos'), ('eletrônicos'), ('motorizadas'), ('viaturas'), ('roupas'), ('outros ...');

-- Tabela Imagem_Item
CREATE TABLE IF NOT EXISTS tb_imagem_item (
    id_imagem INT AUTO_INCREMENT PRIMARY KEY,
    imagem_item VARCHAR(255) NOT NULL UNIQUE,
    data_imagem DATETIME NOT NULL DEFAULT NOW(),
    status TINYINT(1) DEFAULT 1
);

-- Tabela Item_Perdido
CREATE TABLE IF NOT EXISTS tb_item_perdido (
    id_item_perdido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    descricao TEXT NOT NULL,
    data_perda DATE NULL,
    local_perda VARCHAR(255) NULL,
    id_categoria INT NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT NOW(),
    data_edicao DATETIME NOT NULL DEFAULT NOW(),
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES tb_usuario(id_usuario),
    FOREIGN KEY (id_categoria) REFERENCES tb_categoria(id_categoria)
);

-- Tabela Item_Encontrado
CREATE TABLE IF NOT EXISTS tb_item_encontrado (
    id_item_encontrado INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    descricao TEXT NOT NULL,
    data_encontro DATE NULL,
    local_encontro VARCHAR(255) NULL,
    id_categoria INT NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT NOW(),
    data_edicao DATETIME NOT NULL DEFAULT NOW(),
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES tb_usuario(id_usuario),
    FOREIGN KEY (id_categoria) REFERENCES tb_categoria(id_categoria)
);

-- Tabela Imagen_Item Perdidos e Encontrados
CREATE TABLE IF NOT EXISTS tb_imagens (
    id_imagem INT AUTO_INCREMENT PRIMARY KEY,
    id_item_perdido INT NOT NULL,
    id_item_encontrado INT NOT NULL,
    id_imagem_item INT NOT NULL,
    data_imagem DATETIME NOT NULL DEFAULT NOW(),
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_item_perdido) REFERENCES tb_item_perdido(id_item_perdido),
    FOREIGN KEY (id_item_encontrado) REFERENCES tb_item_encontrado(id_item_encontrado),
    FOREIGN KEY (id_imagem_item) REFERENCES tb_imagem_item(id_imagem)
);

-- Tabela Notificações
CREATE TABLE IF NOT EXISTS tb_notificacoes (
    id_notificacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_perdedor INT NOT NULL,
    id_item_perdido INT NOT NULL,
    mensagem TEXT NOT NULL,
    data_notificacao DATETIME DEFAULT NOW(),
    status ENUM('enviada', 'lida') DEFAULT 'enviada',
    FOREIGN KEY (id_usuario_perdedor) REFERENCES tb_usuario(id_usuario),
    FOREIGN KEY (id_item_perdido) REFERENCES tb_item_perdido(id_item_perdido)
);

-- Tabela Entrega_Item
CREATE TABLE IF NOT EXISTS Entrega_Item (
    id_entrega INT AUTO_INCREMENT PRIMARY KEY,
    id_item_perdido INT NOT NULL,
    id_item_encontrado INT NOT NULL,
    id_usuario_perdedor INT NOT NULL,
    id_usuario_encontrador INT NOT NULL,
    local_entrega VARCHAR(255) NOT NULL,
    data_entrega DATETIME NOT NULL DEFAULT NOW(),
    status ENUM('pendente', 'realizada') DEFAULT 'pendente',
    FOREIGN KEY (id_item_perdido) REFERENCES tb_item_perdido(id_item_perdido),
    FOREIGN KEY (id_item_encontrado) REFERENCES tb_item_encontrado(id_item_encontrado),
    FOREIGN KEY (id_usuario_perdedor) REFERENCES tb_usuario(id_usuario),
    FOREIGN KEY (id_usuario_encontrador) REFERENCES tb_usuario(id_usuario)
);
