Wy mambo! **TÁ FIXE!** Vou criar a documentação completa, profissional, bem estruturada. Isto vai ser a base sólida mesmo, tá? Deixa-me fazer isto com tudo detalhadinho:

---

# **📋 DOCUMENTAÇÃO TÉCNICA - SISTEMA ADMINISTRATIVO CINEIZE**
## **v2.0 - Arquitetura Consolidada**

---

## **1. INTRODUÇÃO**

O Sistema Administrativo CINEIZE é uma plataforma de gestão centralizada para:
- Múltiplos cinemas distribuídos em Angola
- Gestão de filmes, sessões e bilhetes
- Sistema de exibições genérico (prévenda, normal, IMAX, eventos, etc)
- Precificação dinâmica e flexível
- Validação de bilhetes em tempo real
- Notificações automáticas para clientes

**Principios de Design:**
- ✅ Uma tabela genérica para exibições (polimorfismo)
- ✅ Seleção por formato (não sala específica)
- ✅ Sistema de preço multi-camadas
- ✅ Datas como fonte de verdade
- ✅ Roles diferenciados por acesso

---

## **2. ENTIDADES PRINCIPAIS (Data Model)**

### **2.1 CAMADA GEOGRAFIA**

```
LOCALIZAÇÃO (Cidades/Províncias)
├── id (INT, PK)
├── nome (VARCHAR) - ex: "Luanda", "Benguela"
├── provincia (VARCHAR)
├── latitude (DECIMAL)
├── longitude (DECIMAL)
└── ativa (BOOLEAN)

Relacionamento: Um para Muitos com Cinema
```

---

### **2.2 CAMADA INFRAESTRUTURA**

```
CINEMA
├── id (INT, PK)
├── localizacao_id (INT, FK → Localização)
├── nome (VARCHAR) - ex: "CINEIZE Luanda Talatona"
├── descricao (TEXT)
├── endereco_completo (VARCHAR)
├── latitude (DECIMAL)
├── longitude (DECIMAL)
├── telefone (VARCHAR)
├── email (VARCHAR)
├── imagens (JSON array de URLs)
├── horario_abertura (TIME)
├── horario_fechamento (TIME)
├── ativa (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Relacionamentos:
├─ Um para Muitos com Sala
├─ Um para Muitos com config_horario
├─ Um para Muitos com config_formato
└─ Um para Muitos com config_prevenda
```

```
SALA
├── id (INT, PK)
├── cinema_id (INT, FK)
├── numero_sala (INT)
├── nome (VARCHAR) - ex: "Sala 1", "VIP"
├── formato (ENUM: '2D', '3D', '4D', 'MAX')
├── capacidade (INT)
├── imagens (JSON array de URLs)
├── descricao (TEXT)
├── ativa (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Validação:
├─ Cada sala = UM ÚNICO FORMATO
├─ Capacidade > 0
└─ Formato deve ser válido

Relacionamentos:
├─ Muitos para Um com Cinema
├─ Um para Muitos com Assento
└─ Um para Muitos com Sessao
```

```
ASSENTO
├── id (INT, PK)
├── sala_id (INT, FK)
├── fila (CHAR) - ex: 'A', 'B', 'C'
├── numero (INT) - ex: 1, 2, 3
├── tipo (ENUM: 'normal', 'vip', 'acessibilidade')
├── ativa (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Validação:
├─ Combinação (sala_id, fila, numero) = ÚNICA
├─ Fila entre A-Z
└─ Número >= 1

Relacionamentos:
├─ Muitos para Um com Sala
└─ Um para Muitos com Bilhete
```

---

### **2.3 CAMADA CONTEÚDO**

```
FILME
├── id (INT, PK)
├── titulo (VARCHAR)
├── sinopse (TEXT)
├── duracao_minutos (INT)
├── generos (JSON array: ['Ação', 'Ficção', ...])
├── classificacao_etaria (ENUM: 'G', 'PG', 'PG-13', '12', '14', '16', '18')
├── poster_url (VARCHAR)
├── backdrop_url (VARCHAR)
├── director (VARCHAR)
├── elenco (JSON array)
├── data_lancamento_mundial (DATE) - apenas info
├── preco_base (DECIMAL) - preço base em Kz
├── sistema_dinamico (BOOLEAN) - usar multiplicadores?
├── ativa (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Relacionamentos:
├─ Um para Muitos com Exibicao
└─ Um para Muitos com Sessao
```

---

### **2.4 CAMADA EXIBIÇÕES (⭐ GENÉRICA)**

```
EXIBICAO (Entidade Polimórfica)
├── id (INT, PK)
├── filme_id (INT, FK)
├── nome (VARCHAR) - ex: "Prévenda Especial", "IMAX Exclusive"
├── tipo (ENUM: 
│   ├── 'prevenda'          - Venda antecipada
│   ├── 'exibicao_normal'   - Sessão padrão
│   ├── 'reexibicao'        - Filme antigo relançado
│   ├── 'especial'          - Director's Cut, Extended
│   ├── 'imax_exclusive'    - Premium format
│   └── 'live_event'        - Transmissão ao vivo
│ )
├── descricao (TEXT)
├── data_inicio (DATE) - quando começa
├── data_fim (DATE) - quando termina (NULL = sem fim)
├── preco_multiplicador (DECIMAL) - ex: 1.15 (+15%), 2.0 (+100%)
├── ativa (BOOLEAN)
├── criado_por (INT, FK → Usuario)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Validação:
├─ data_inicio < data_fim OU data_fim IS NULL
├─ UNIQUE(filme_id, tipo, data_inicio) - não 2 mesmas tipos no mesmo dia
└─ Preco_multiplicador > 0

Relacionamentos:
├─ Muitos para Um com Filme
├─ Um para Muitos com Sessao
└─ Um para Muitos com Inscricao
```

---

### **2.5 CAMADA SESSÕES**

```
SESSAO
├── id (INT, PK)
├── filme_id (INT, FK)
├── sala_id (INT, FK)
├── exibicao_id (INT, FK) - ⭐ Linkado a qualquer tipo de exibição!
├── data_hora_inicio (DATETIME)
├── preco (DECIMAL) - preço final calculado
├── tipo_sessao (ENUM: 'prevenda', 'normal') - ⭐ AUTO-CALCULADO
├── capacidade (INT) - cópia de sala.capacidade
├── ocupacao_atual (INT DEFAULT 0)
├── estado (ENUM: 'disponivel', 'lotado', 'cancelado')
├── ativa (BOOLEAN)
├── criado_por (INT, FK → Usuario)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Campos Calculados (GENERATED):
├── tipo_sessao = CASE WHEN exibicao_id NOT NULL THEN 'prevenda' 
│                      ELSE 'normal' END
└── taxa_ocupacao = (ocupacao_atual / capacidade) * 100

Validação:
├─ data_hora_inicio > NOW() (não pode criar sessão no passado)
├─ UNIQUE(sala_id, data_hora_inicio) - sem overlaps
├─ preco > 0
├─ ocupacao_atual <= capacidade
└─ formato_sala compatible com filme

Relacionamentos:
├─ Muitos para Um com Filme
├─ Muitos para Um com Sala
├─ Muitos para Um com Exibicao
└─ Um para Muitos com Bilhete
```

---

### **2.6 CAMADA VENDAS & NOTIFICAÇÕES**

```
BILHETE
├── id (INT, PK)
├── sessao_id (INT, FK)
├── assento_id (INT, FK)
├── cliente_id (INT, FK) - pode ser anonimizado
├── email (VARCHAR)
├── telefone (VARCHAR)
├── preco_pago (DECIMAL)
├── estado (ENUM: 
│   ├── 'reservado'   - Apenas reserva (pode expirar)
│   ├── 'confirmado'  - Pagamento confirmado
│   ├── 'validado'    - Entrada feita (QR scaneado)
│   └── 'cancelado'   - Reembolsado
│ )
├── qr_code (VARCHAR) - string do QR
├── codigo_barras (VARCHAR)
├── numero_controlo (VARCHAR) - ex: "ABC123456"
├── data_compra (DATETIME)
├── data_validacao (DATETIME) - quando entrou
├── validado_por (INT, FK → Usuario)
├── metodo_pagamento (ENUM: 'pay_rural', 'dinheiro', 'cartao', 'outro')
├── referencia_pagamento (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Validação:
├─ assento_id pertence à sala da sessao_id
├─ estado segue fluxo: reservado → confirmado → validado
├─ numero_controlo é ÚNICO
├─ qr_code é ÚNICO
└─ data_validacao > data_compra

Relacionamentos:
├─ Muitos para Um com Sessao
├─ Muitos para Um com Assento
├─ Muitos para Um com Cliente (nullable)
└─ Muitos para Um com Usuario (validador)
```

```
INSCRICAO_NOTIFICACAO
├── id (INT, PK)
├── exibicao_id (INT, FK) - ⭐ Qualquer tipo de exibição!
├── cliente_id (INT, FK)
├── email (VARCHAR)
├── telefone (VARCHAR)
├── metodo (ENUM: 'email', 'whatsapp', 'sms')
├── data_inscricao (TIMESTAMP)
├── notificado (BOOLEAN DEFAULT FALSE)
├── data_notificacao (TIMESTAMP)
├── link_notificacao (VARCHAR) - token único para um-click
├── ativa (BOOLEAN DEFAULT TRUE)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Validação:
├─ UNIQUE(exibicao_id, cliente_id) - não duplicar
├─ Email ou Telefone preenchido
├─ Método válido para contacto
└─ Data_notificacao >= data_inscricao

Relacionamentos:
├─ Muitos para Um com Exibicao
└─ Muitos para Um com Cliente
```

```
HISTORICO_NOTIFICACOES
├── id (INT, PK)
├── exibicao_id (INT, FK)
├── inscritos_totais (INT)
├── notificados_sucesso (INT)
├── notificados_erro (INT)
├── data_execucao (TIMESTAMP)
├── status (ENUM: 'pendente', 'enviado', 'parcial', 'erro')
├── erro_mensagem (TEXT)
└── created_at (TIMESTAMP)

Relacionamentos:
└─ Muitos para Um com Exibicao
```

---

### **2.7 CAMADA CONFIGURAÇÃO (Dinâmica)**

```
CONFIG_HORARIO (Matriz de horários por cinema)
├── id (INT, PK)
├── cinema_id (INT, FK)
├── dia_semana (ENUM: 'seg','ter','qua','qui','sex','sab','dom')
├── hora_inicio (TIME)
├── hora_fim (TIME)
├── multiplicador (DECIMAL) - ex: 0.8 (-20%), 1.3 (+30%)
├── ativa (BOOLEAN)
└── created_at (TIMESTAMP)

Validação:
├─ hora_inicio < hora_fim
├─ multiplicador > 0
└── UNIQUE(cinema_id, dia_semana, hora_inicio)
```

```
CONFIG_FORMATO (Multiplicadores por formato)
├── id (INT, PK)
├── cinema_id (INT, FK)
├── formato (ENUM: '2D', '3D', '4D', 'MAX')
├── multiplicador (DECIMAL) - ex: 1.0, 1.5, 2.0, 2.2
├── ativa (BOOLEAN)
└── created_at (TIMESTAMP)

Validação:
├─ multiplicador > 0
└── UNIQUE(cinema_id, formato)
```

```
FERIADO
├── id (INT, PK)
├── data (DATE)
├── nome (VARCHAR) - ex: "Independência Nacional"
├── multiplicador (DECIMAL) - ex: 1.2 (+20%), 1.5 (+50%)
├── ativa (BOOLEAN)
└── created_at (TIMESTAMP)

Validação:
└─ Data única
```

```
CONFIG_PREVENDA (Extra para exibições de prévenda)
├── id (INT, PK)
├── cinema_id (INT, FK)
├── percentual_extra (DECIMAL) - ex: 15 (significa +15%)
├── ativa (BOOLEAN)
└── created_at (TIMESTAMP)

Validação:
└─ percentual_extra >= 0
```

---

### **2.8 CAMADA USUÁRIOS & AUDITORIA**

```
USUARIO
├── id (INT, PK)
├── cinema_id (INT, FK) - NULL para Super Admin
├── nome (VARCHAR)
├── email (VARCHAR) - UNIQUE
├── password_hash (VARCHAR)
├── telefone (VARCHAR)
├── role (ENUM: 'super_admin', 'gerente_cinema', 'funcionario_balcao', 'viewer')
├── ativo (BOOLEAN)
├── ultimo_acesso (DATETIME)
├── criado_por (INT, FK → Usuario)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Validação:
├─ Role 'super_admin' → cinema_id DEVE ser NULL
├─ Role 'gerente_cinema' → cinema_id NÃO NULL
└─ Email válido e único
```

```
AUDITORIA
├── id (INT, PK)
├── usuario_id (INT, FK)
├── tabela_afetada (VARCHAR) - ex: "sessao", "bilhete"
├── operacao (ENUM: 'CREATE', 'UPDATE', 'DELETE')
├── registro_id (INT)
├── dados_anteriores (JSON)
├── dados_novos (JSON)
├── descricao (VARCHAR)
├── ip_origem (VARCHAR)
├── user_agent (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Uso: Rastreamento completo de quem fez quê, quando e porquê
```

---

## **3. DIAGRAMA ENTIDADES-RELACIONAMENTOS**

```
┌─────────────────────────────────────────────────────────────┐
│                      GEOGRAFIA                              │
├─────────────────────────────────────────────────────────────┤
│  Localizacao                                                │
│  ├─ id, nome, provincia, latitude, longitude                │
│  └─ 1 para Muitos ──→ Cinema                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    INFRAESTRUTURA                            │
├─────────────────────────────────────────────────────────────┤
│  Cinema                                                     │
│  ├─ id, nome, descricao, imagens, horarios                  │
│  ├─ 1 para Muitos ──→ Sala                                  │
│  ├─ 1 para Muitos ──→ Config_Horario                        │
│  ├─ 1 para Muitos ──→ Config_Formato                        │
│  └─ 1 para Muitos ──→ Config_Prevenda                       │
│                                                              │
│  Sala                                                       │
│  ├─ id, numero, formato (ÚNICA CHAVE!)                      │
│  ├─ 1 para Muitos ──→ Assento                               │
│  └─ 1 para Muitos ──→ Sessao                                │
│                                                              │
│  Assento                                                    │
│  ├─ id, fila, numero, tipo                                  │
│  └─ 1 para Muitos ──→ Bilhete                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      CONTEÚDO                               │
├─────────────────────────────────────────────────────────────┤
│  Filme                                                      │
│  ├─ id, titulo, sinopse, duracao, generos                   │
│  ├─ preco_base, sistema_dinamico                            │
│  ├─ 1 para Muitos ──→ Exibicao                              │
│  └─ 1 para Muitos ──→ Sessao                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXIBIÇÕES (⭐ GENÉRICA)                  │
├─────────────────────────────────────────────────────────────┤
│  Exibicao (Polimórfica)                                     │
│  ├─ id, filme_id, nome, tipo (prevenda/normal/imax/...)    │
│  ├─ data_inicio, data_fim                                   │
│  ├─ preco_multiplicador                                     │
│  ├─ 1 para Muitos ──→ Sessao                                │
│  └─ 1 para Muitos ──→ Inscricao_Notificacao                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      SESSÕES                                │
├─────────────────────────────────────────────────────────────┤
│  Sessao                                                     │
│  ├─ id, filme_id, sala_id, exibicao_id (FK)                │
│  ├─ data_hora_inicio, preco                                 │
│  ├─ tipo_sessao (GENERATED: prevenda/normal)                │
│  ├─ 1 para Muitos ──→ Bilhete                               │
│  └─ Validação: UNIQUE(sala_id, data_hora_inicio)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  VENDAS & NOTIFICAÇÕES                       │
├─────────────────────────────────────────────────────────────┤
│  Bilhete                                                    │
│  ├─ id, sessao_id, assento_id                               │
│  ├─ estado (reservado → confirmado → validado)              │
│  ├─ qr_code, codigo_barras, numero_controlo                 │
│  └─ preco_pago, metodo_pagamento                            │
│                                                              │
│  Inscricao_Notificacao                                      │
│  ├─ id, exibicao_id (FK para qualquer tipo!)                │
│  ├─ cliente_id, email, telefone                             │
│  ├─ metodo (email/whatsapp/sms)                             │
│  ├─ data_inscricao, notificado                              │
│  └─ link_notificacao (token único)                          │
│                                                              │
│  Historico_Notificacoes                                     │
│  ├─ id, exibicao_id                                         │
│  ├─ inscritos_totais, notificados_sucesso                   │
│  └─ status, data_execucao                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## **4. NÍVEIS DE ACESSO (RBAC - Role Based Access Control)**

### **4.1 SUPER ADMIN (Acesso Global)**

```
┌─────────────────────────────────────────────────┐
│          SUPER ADMIN / GESTOR GERAL             │
├─────────────────────────────────────────────────┤
│ Nível: Máximo (acesso total)                    │
│ Cinema: NULL (global)                           │
└─────────────────────────────────────────────────┘

PERMISSÕES:
├─ 🏢 GESTÃO DE CINEMAS
│  ├─ Criar, editar, deletar cinemas
│  ├─ Configurar horários por cinema
│  ├─ Configurar multiplicadores de formato
│  ├─ Definir feriados globais
│  └─ Gerir configs de prévenda
│
├─ 🎬 GESTÃO DE FILMES (Global)
│  ├─ Registar novo filme
│  ├─ Editar informações
│  ├─ Deletar filme (soft delete)
│  └─ Ver todos os filmes de todos os cinemas
│
├─ 📺 GESTÃO DE EXIBIÇÕES (Global)
│  ├─ Criar exibição qualquer tipo
│  ├─ Editar/deletar exibições
│  ├─ Cancelar exibições em massa
│  └─ Ver todas exibições de todos filmes
│
├─ 🎫 GESTÃO DE SESSÕES (Global)
│  ├─ Criar sessões em qualquer cinema
│  ├─ Editar preços
│  ├─ Cancelar sessões
│  ├─ Gerenciar capacidades
│  └─ Redistribuir sessões entre salas
│
├─ 👥 GESTÃO DE USUÁRIOS
│  ├─ Criar gerentes de cinema
│  ├─ Criar funcionários
│  ├─ Alterar roles
│  ├─ Desativar contas
│  └─ Ver histórico de acessos
│
├─ 📊 DASHBOARDS & ANALYTICS
│  ├─ Dashboard global (todos os cinemas)
│  ├─ Filmes mais vendidos (top 10, 50, 100)
│  ├─ Receita total by cinema
│  ├─ Taxa ocupação média
│  ├─ Distribuição por formato
│  ├─ Distribuição por género
│  ├─ Relatórios comparativos
│  ├─ Exportar relatórios (PDF, Excel)
│  └─ Análise de tendências (gráficos)
│
├─ 🔔 NOTIFICAÇÕES (Global)
│  ├─ Ver todas notificações
│  ├─ Histórico de campanhas
│  ├─ Estatísticas por exibição
│  └─ Reenviar notificações (se falha)
│
└─ 🛠️ CONFIGURAÇÕES
   ├─ Parametrizações globais
   ├─ Ver auditoria completa
   └─ Backup & restore

ACESSO A DADOS:
├─ Filme: TODAS
├─ Exibicao: TODAS
├─ Sessao: TODAS
├─ Bilhete: TODOS
├─ Cinema: TODOS
└─ Inscricao: TODAS
```

### **4.2 GERENTE DE CINEMA (Acesso Singular)**

```
┌─────────────────────────────────────────────────┐
│       GERENTE DE CINEMA (Acesso Singular)       │
├─────────────────────────────────────────────────┤
│ Nível: Médio-Alto (seu cinema apenas)           │
│ Cinema: X (específico, não NULL)                │
└─────────────────────────────────────────────────┘

PERMISSÕES:
├─ 🏢 GESTÃO DO SEU CINEMA
│  ├─ Ver informações do cinema
│  ├─ Editar horários (consultar super admin para mudanças)
│  ├─ Gerenciar salas (criar, editar)
│  ├─ Ver assentos
│  └─ Ver histórico do cinema
│
├─ 🎬 FILMES (Seu cinema)
│  ├─ Ver filmes que estão em seu cinema
│  ├─ NÃO pode criar novo filme (solicita super admin)
│  └─ Pode sugerir preço base
│
├─ 📺 EXIBIÇÕES (Seu cinema)
│  ├─ Criar exibições para filmes disponíveis
│  ├─ Editar multiplicadores de preço
│  ├─ Cancelar exibições
│  ├─ Ver inscrições por exibição
│  └─ Ver quantos se inscreveram
│
├─ 🎫 SESSÕES (Seu cinema)
│  ├─ Criar sessões (seleciona formato, não sala)
│  ├─ Sistema auto-aloca a sala disponível
│  ├─ Editar preço da sessão
│  ├─ Cancelar sessão (se houver motivo)
│  ├─ Gerar bilhete manual (balcão)
│  ├─ Ver ocupação em tempo real
│  └─ Validar bilhetes (QR code, etc)
│
├─ 👥 FUNCIONÁRIOS (Seu cinema)
│  ├─ Ver funcionários do seu cinema
│  ├─ Criar conta de funcionário (approve super admin)
│  └─ Desativar funcionário
│
├─ 📊 DASHBOARDS (Seu cinema)
│  ├─ Dashboard do cinema (métricas locais)
│  ├─ Filmes mais vendidos no seu cinema
│  ├─ Receita do seu cinema
│  ├─ Taxa ocupação por sala
│  ├─ Horário mais procurado
│  ├─ Sessões com baixa ocupação (alertas)
│  ├─ Inscrições para notificação
│  └─ Comparação com média nacional
│
├─ 🔔 NOTIFICAÇÕES (Seu cinema)
│  ├─ Ver notificações que foram enviadas
│  ├─ Histórico de campanhas do seu cinema
│  ├─ Quantos se inscreveram para cada exibição
│  └─ Taxa de abertura de emails
│
└─ 📄 RELATÓRIOS (Seu cinema)
   ├─ Relatórios do seu cinema
   ├─ Exportar (PDF, Excel)
   └─ Análise de performance local

ACESSO A DADOS:
├─ Filme: Apenas os que têm sessão no seu cinema
├─ Exibicao: Apenas as do seu cinema
├─ Sessao: Apenas as do seu cinema
├─ Bilhete: Apenas bilhetes das sessões do seu cinema
├─ Cinema: APENAS o seu
└─ Inscricao: Apenas para exibições do seu cinema
```

### **4.3 FUNCIONÁRIO DE BALCÃO (POS - Point of Sale)**

```
┌─────────────────────────────────────────────────┐
│    FUNCIONÁRIO DE BALCÃO (Read-Only + Venda)    │
├─────────────────────────────────────────────────┤
│ Nível: Baixo (execução apenas)                  │
│ Cinema: X (específico)                          │
└─────────────────────────────────────────────────┘

PERMISSÕES:
├─ 📺 VER SESSÕES (Seu cinema)
│  ├─ Ver sessões de hoje, semana, mês
│  ├─ Filtrar por filme, horário
│  ├─ Ver assentos disponíveis
│  └─ Ver preço
│
├─ 🎫 GERAR BILHETE (Seu cinema)
│  ├─ Selecionar película → Sessão
│  ├─ Selecionar assentos
│  ├─ Inserir dados cliente (email/telefone - opcional)
│  ├─ Processar pagamento
│  ├─ Gerar QR code + número de controlo
│  ├─ Imprimir (se máquina disponível)
│  └─ Enviar email/SMS ao cliente
│
├─ ✅ VALIDAR BILHETE (Entrada)
│  ├─ Scanear QR code
│  ├─ OU inserir código de barras
│  ├─ OU digitar número de controlo
│  ├─ OU buscar por email/telefone
│  ├─ Confirmar dados do cliente
│  ├─ Marcar assento como "validado"
│  ├─ Autorizar entrada
│  └─ Imprimir comprovante entrada (opcional)
│
├─ 📋 VER (Read-only)
│  ├─ Filmes em exibição
│  ├─ Horários das sessões
│  ├─ Preço da sessão
│  ├─ Capacidade/ocupação
│  └─ Seus vendas do dia
│
└─ ❌ NÃO TEM ACESSO A:
   ├─ Criar exibições
   ├─ Criar sessões
   ├─ Editar preços
   ├─ Ver relatórios
   ├─ Ver dados de outros funcionários
   └─ Configurações

ACESSO A DADOS:
├─ Filme: Read-only (exibindo)
├─ Sessao: Read-only (seu cinema)
├─ Bilhete: Create (gerar), Read (consultar), Update (validar)
├─ Assento: Read-only
└─ Inscricao: Read-only (consultar ao gerar bilhete)
```

### **4.4 MATRIZ DE PERMISSÕES (Resumo)**

```
╔═══════════════════════════════════════════════════════════════════════════╗
║ FUNCIONALIDADE          │ SUPER ADMIN │ GERENTE │ FUNCIONÁRIO │ VIEWER   ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ Criar Cinema            │     ✅      │   ❌    │     ❌      │   ❌     ║
║ Editar Cinema           │     ✅      │   ⚠️*   │     ❌      │   ❌     ║
║ Criar Filme             │     ✅      │   ❌    │     ❌      │   ❌     ║
║ Criar Exibição          │     ✅      │   ✅**  │     ❌      │   ❌     ║
║ Criar Sessão            │     ✅      │   ✅**  │     ❌      │   ❌     ║
║ Gerar Bilhete (Balcão)  │     ✅      │   ✅**  │    ✅***    │   ❌     ║
║ Validar Bilhete (QR)    │     ✅      │   ✅**  │    ✅***    │   ❌     ║
║ Ver Dashboard Global    │     ✅      │   ❌    │     ❌      │   ❌     ║
║ Ver Dashboard Cinema    │     ✅      │   ✅**  │     ❌      │   ❌     ║
║ Ver Auditoria           │     ✅      │   ⚠️*   │     ❌      │   ❌     ║
║ Criar Usuário           │     ✅      │   ❌    │     ❌      │   ❌     ║
║ Editar Relatórios       │     ✅      │   ✅**  │     ❌      │   ❌     ║
╚═══════════════════════════════════════════════════════════════════════════╝

* ⚠️  = Com approval super admin
** = Apenas seu cinema
*** = Apenas durante turno
```

---

## **5. FLUXOS PRINCIPAIS**

### **5.1 FLUXO DE SETUP INICIAL (Super Admin)**

```
PASSO 1: Registar Cinema
──────────────────────────────
Super Admin: "Cinemas" → "+ Novo Cinema"
├─ Nome: "CINEIZE Talatona"
├─ Localização: Luanda
├─ Endereço: "Avenida Samba, Shopping Talatona"
├─ Coordenadas GPS: (Auto-fetch de Google Maps)
├─ Horário: 10:00 - 23:00
├─ Upload Imagens (fachada, lobby)
└─ [Criar Cinema]

Sistema:
├─ Valida localização
├─ Cria registro em CINEMA
├─ Cria config_horario default (segunda-domingo)
├─ Cria config_formato default (2D/3D/4D/MAX)
└─ ✅ Cinema criado

PASSO 2: Criar Salas
───────────────────
Admin do Cinema: "Salas" → "+ Nova Sala"
├─ Número: 1
├─ Nome: "Sala Premium"
├─ Formato: [3D ▼]  ← Um único formato!
├─ Capacidade: 120
├─ Upload Imagens (foto da sala)
└─ [Criar Sala]

Sistema:
├─ Valida formato único
├─ Cria registro em SALA
└─ Auto-gera layout de assentos:
   ├─ Filas: A-J (10 filas)
   ├─ Números: 1-12 (12 por fila)
   └─ Total: 120 assentos

PASSO 3: Registar Filme
──────────────────────
Super Admin: "Filmes" → "+ Novo Filme"
├─ Título: "Avatar: The Way of Water"
├─ Sinopse: [texto]
├─ Duração: 192 minutos
├─ Géneros: ['Ficção Científica', 'Ação', 'Aventura']
├─ Classificação: 12
├─ Upload Poster
├─ Preço Base: 500 kz
├─ Sistema Dinâmico: ✓ SIM
└─ [Registar Filme]

Sistema:
├─ Valida dados
├─ Cria registro em FILME
└─ ✅ Filme pronto para exibições

PASSO 4: Configurar Multiplicadores (Por Cinema)
─────────────────────────────────────────────────
Gerente: "Configurações" → "Multiplicadores"

┌─ Horários (Matriz por dia/hora)
│  ┌──────────────────────────────────────┐
│  │ DIA      │ Matinée │ Tarde │ Noite  │
│  ├──────────────────────────────────────┤
│  │ Seg-Sex  │ 0.8    │ 0.9   │ 1.0   │
│  │ Sábado   │ 0.9    │ 1.1   │ 1.3   │
│  │ Domingo  │ 0.95   │ 1.1   │ 1.2   │
│  │ Feriado  │ 1.2    │ 1.3   │ 1.5   │
│  └──────────────────────────────────────┘

├─ Formatos
│  ├─ 2D:  1.0 (base)
│  ├─ 3D:  1.5 (+50%)
│  ├─ 4D:  2.0 (+100%)
│  └─ MAX: 2.2 (+120%)

├─ Extra Prévenda: 15%

└─ [Salvar Configurações]
```

---

### **5.2 FLUXO DE CRIAÇÃO DE EXIBIÇÃO**

```
PASSO 1: Criar Exibição (Qualquer Tipo)
────────────────────────────────────────

Gerente: "Exibições" → "+ Nova Exibição"

├─ Selecionar Filme: [Avatar: The Way of Water ▼]
│
├─ Tipo de Exibição: [Prévenda ▼]
│  └─ Opções: Prévenda, Normal, Re-exibição, Especial, IMAX, Live Event
│
├─ Nome: "Early Bird - 48h Exclusive"
│  └─ Descrição: "Acesso antecipado para primeiros 48h"
│
├─ Data Início: [20/09/2024]
├─ Data Fim: [21/09/2024] (opcional)
│
├─ Multiplicador de Preço: [1.15] (+15%)
│  └─ Sistema mostra: "Preço final aprox: 575 kz" (500 × 1.15)
│
└─ [Criar Exibição]

Sistema valida:
├─ Filme existe? ✓
├─ Tipo válido? ✓
├─ data_inicio < data_fim? ✓
├─ Não há outra prévenda mesma data? ✓
└─ ✅ Exibição criada

Resultado:
├─ exibicao.id = 42
├─ exibicao.tipo = 'prevenda'
├─ exibicao.data_inicio = 2024-09-20
└─ Aguardando: Criar SESSÕES para esta exibição

PASSO 2: Notificar Inscritos (Automático)
──────────────────────────────────────────

Job Cron (executado em 2024-09-20 às 08:00):
├─ Busca exibicoes.data_inicio = TODAY
├─ Para cada exibição ativa:
│   ├─ Busca inscricoes com exibicao_id = X
│   ├─ Gera link único (token)
│   ├─ Envia email/WhatsApp: "Avatar já está em prévenda!"
│   ├─ Marca inscricao.notificado = TRUE
│   └─ Log em historico_notificacoes
└─ ✅ Campanhas enviadas

Exemplo Email:
┌────────────────────────────────────────┐
│ Assunto: Avatar em Prévenda!           │
│                                        │
│ Olá Xavier!                            │
│                                        │
│ Avatar: The Way of Water está agora   │
│ disponível em prévenda!                │
│                                        │
│ 📅 Disponível a partir de: 20/09      │
│ 💰 Preço especial Early Bird: 575 kz   │
│                                        │
│ [Reservar Bilhete Agora]               │
│ (link com token: abc123xyz)            │
│                                        │
│ Clique acima para fazer sua reserva   │
│ Oferta válida por 48h!                 │
└────────────────────────────────────────┘
```

---

### **5.3 FLUXO DE CRIAÇÃO DE SESSÃO**

```
PASSO 1: Criar Sessão
──────────────────────

Gerente: "Sessões" → "+ Nova Sessão"

├─ Filme: [Avatar: The Way of Water ▼]
│  └─ Mostra: "3 exibições disponíveis"
│
├─ Exibição: [Early Bird - 48h Exclusive ▼]
│  └─ Info: "Tipo: Prévenda | Mult: 1.15x | Vigente: 20-21/09"
│
├─ Formato: [3D ▼]  ← Formato, NÃO sala!
│  └─ Sistema mostra:
│      ├─ Cinema tem 3 salas 3D
│      ├─ Sala A (disponível às 15:00)
│      ├─ Sala B (ocupada às 15:00)
│      └─ Sala C (disponível às 15:00)
│
├─ Data/Hora: [20/09/2024 15:00]
│  └─ Valida: Está entre data_inicio e data_fim de exibição? ✓
│
├─ [Verificar Disponibilidade]
│  └─ ✅ Salas livres: A, C (mostra opções)
│
├─ Sala Escolhida: [Sala A (Capacidade: 120)] OU [Deixar sistema escolher]
│
├─ Preço: [575] kz
│  └─ Sistema calcula automático se dinâmico ativo:
│      └─ 500 (base) × 1.15 (exibição) = 575 kz
│  └─ Admin pode override se quiser: [X] Manual
│
└─ [Criar Sessão]

Sistema:
├─ Valida:
│   ├─ data_hora_inicio > NOW()? ✓
│   ├─ Sala está livre nesta hora? ✓
│   ├─ Sala tem este formato? ✓
│   └─ Exibição está ativa? ✓
│
├─ Cria sessao:
│   ├─ sessao.exibicao_id = 42
│   ├─ sessao.tipo_sessao = 'prevenda' (GENERATED!)
│   ├─ sessao.preco = 575
│   └─ sessao.ocupacao_atual = 0
│
├─ Bloqueia assentos da sala:
│   └─ assento.ativa = TRUE (todos disponíveis)
│
└─ ✅ Sessão criada (id = 1001)

PASSO 2: Validação Automática
──────────────────────────────

Sistema checa periodicamente (30s):
├─ Esta sessão está no passado? → Marcar como "encerrada"
├─ Todos assentos vendidos? → Marca como "lotado"
├─ Há cancelamento? → Libera assentos
└─ Atualiza dashboard em tempo real
```

---

### **5.4 FLUXO DE VENDA (2 Cenários)**

#### **CENÁRIO A: VENDA ONLINE (Cliente Portal)**

```
⚠️ Nota: Este fluxo é da aplicação CLIENTE (não administrativo)
         Mencionado aqui para contexto de bilhetes no admin

Cliente: Acessa website CINEIZE
├─ Vê Avatar em prévenda
├─ Clica "Reservar"
├─ Seleciona Cinema → Sessão
├─ Escolhe Assentos (visualização interativa)
├─ Confirma (assentos bloqueados por 10min)
├─ Pagamento (Pay Rural / Forward)
└─ ✅ Bilhete Digital + QR Code

Sistema Admin vê:
├─ Bilhete criado automaticamente
├─ Estado: 'confirmado'
├─ QR code: [gera automaticamente]
├─ Email do cliente: [preenchido]
├─ Data compra: [automática]
└─ Assento: bloqueado
```

#### **CENÁRIO B: VENDA BALCÃO (Funcionário POS)**

```
PASSO 1: Abrir Painel de Venda
───────────────────────────────

Funcionário: "Vender Bilhete"
├─ Selecionar Filme: [Avatar ▼]
│
├─ Selecionar Sessão: [20/09 15:00 - Sala A - 3D ▼]
│  └─ Info: "Preço: 575 kz | Ocupação: 45/120"
│
├─ [Visualizar Sala]
│  └─ Mapa interativo de assentos:
│      ├─ Verde = Disponível
│      ├─ Vermelho = Ocupado
│      └─ Admin pode clicar para selecionar
│
└─ Seleciona Assentos: [A1, A2, A3] (3 assentos)
   └─ Sistema bloqueia imediatamente (time-lock 10min)

PASSO 2: Dados do Cliente
──────────────────────────

├─ Email: [xavier@example.com]  (opcional)
├─ Telefone: [924123456]        (opcional)
│
└─ Observação: "Cliente prefere fatura digital"

PASSO 3: Pagamento
──────────────────

├─ Método: [Dinheiro ▼]
│  └─ Opções: Dinheiro, Cartão, Pix, Pay Rural
│
├─ Valor: 575 kz × 3 = 1,725 kz
│
├─ Se Cartão:
│   └─ Máquina POS: [inserir cartão]
│       └─ ✅ Pagamento autorizado
│
├─ Se Pay Rural:
│   └─ Sistema gera referência (callback webhook)
│       └─ ✅ Pagamento confirmado
│
└─ [Confirmar Pagamento]

PASSO 4: Gerar Bilhete
──────────────────────

Sistema:
├─ Cria 3 registros em BILHETE:
│   ├─ bilhete_1:
│   │  ├─ sessao_id = 1001
│   │  ├─ assento_id = A1
│   │  ├─ email = xavier@example.com
│   │  ├─ preco_pago = 575
│   │  ├─ estado = 'confirmado'
│   │  ├─ qr_code = "gU7q2K9xP8mL1vN3..." (unique)
│   │  ├─ numero_controlo = "AV-20240920-001"
│   │  └─ created_at = NOW()
│   ├─ bilhete_2: (mesmo padrão, A2)
│   └─ bilhete_3: (mesmo padrão, A3)
│
├─ Marca assentos como "ocupados"
│   └─ ocupacao_atual = 45 + 3 = 48/120
│
├─ Gera QR codes + códigos de barras
│
├─ Formata bilhetes:
│   ├─ Digital: PDF com QR code
│   └─ Impresso (opcional): Papel térmico
│
└─ Envia para cliente:
   ├─ Se email: [xyz@example.com]
   ├─ Se SMS/WhatsApp: [924123456]
   └─ Conteúdo:
      ┌─────────────────────────────────────────┐
      │         BILHETE DIGITAL - CINEIZE        │
      ├─────────────────────────────────────────┤
      │                                         │
      │ Filme: Avatar: The Way of Water        │
      │ Data: 20 de Setembro, 2024 - 15:00    │
      │ Cinema: CINEIZE Talatona               │
      │ Sala: A (Formato: 3D)                  │
      │ Assentos: A1, A2, A3                   │
      │ Total: 1,725 kz                        │
      │                                         │
      │ [QR CODE AQUI]                         │
      │ Número: AV-20240920-001                │
      │                                         │
      │ Válido para: 20/09/2024 15:00         │
      │                                         │
      │ ⚠️  Chegar 15 minutos antes!            │
      │                                         │
      └─────────────────────────────────────────┘

PASSO 5: Finalizar Transação
─────────────────────────────

Funcionário vê:
├─ ✅ Bilhetes gerados com sucesso
├─ Opção: Imprimir (se máquina disponível)
├─ Opção: Enviar email/SMS novamente
└─ [Confirmar Fim]

Sistema registra:
├─ Auditoria: Usuario [Func001] criou 3 bilhetes
├─ Histórico: Cinema A - Sessão 1001 - 1,725 kz
└─ Dashboard: Atualiza ocupação em tempo real
```

---

### **5.5 FLUXO DE VALIDAÇÃO DE BILHETE (Entrada)**

```
LOCAL: Portão de Entrada do Cinema
HORA: 14:50 (10 min antes da sessão)

Funcionário: "Validar Bilhete"
├─ Interface com campo de entrada
│
└─ 4 MÉTODOS POSSÍVEIS:

MÉTODO 1: QR CODE (Preferido)
─────────────────────────────
├─ Funcionário usa scanner (ou câmera do PC)
├─ Aponta para QR do bilhete (digital ou impresso)
│
Resultado:
├─ ✅ QR lido: "gU7q2K9xP8mL1vN3..."
├─ Sistema busca bilhete com este QR
├─ Exibe: "Avatar | 20/09 15:00 | Sala A | Assento A1"
├─ Cliente confirma: "Sim, é meu"
└─ [Validar]

Sistema:
├─ bilhete.estado = 'validado'
├─ bilhete.data_validacao = NOW()
├─ bilhete.validado_por = [funcionário_id]
├─ assento.ativa = FALSE (bloqueia reutilização)
├─ Imprime comprovante: "✅ ENTRADA AUTORIZADA"
└─ Cliente entra! 🎬

MÉTODO 2: CÓDIGO DE BARRAS
───────────────────────────
├─ Scanner de barras lê número
├─ Sistema busca bilhete
├─ Mesmo resultado que QR
└─ ✅ Validado

MÉTODO 3: NÚMERO DE CONTROLO
─────────────────────────────
├─ Cliente diz: "AV-20240920-001"
├─ Funcionário digita no sistema
├─ [Buscar Bilhete]
│
Resultado:
├─ Sistema mostra: "Avatar | 20/09 15:00 | Sala A | Assento A1"
├─ Funcionário CONFIRMA com cliente:
│   ├─ "Seu nome é Xavier?"
│   ├─ "Seu email termina em ...com?"
│   └─ Cliente: "Sim!"
│
└─ [Validar]
   └─ ✅ Validado

MÉTODO 4: EMAIL/TELEFONE
────────────────────────
├─ Funcionário digita: email OU telefone
├─ [Buscar por Contacto]
│
Sistema mostra:
├─ TODAS as bilhetes para esta sessão com este contacto
│  ├─ Bilhete 1: Assento A1
│  ├─ Bilhete 2: Assento A2
│  └─ Bilhete 3: Assento A3
│
├─ Cliente identifica qual é seu:
│   └─ "Eu sou o A2"
│
└─ [Validar A2]
   └─ ✅ Validado (A2 apenas)

VALIDAÇÃO DE SEGURANÇA (Todos os métodos)
──────────────────────────────────────────

Antes de marcar como "validado", sistema checa:

├─ ✓ Bilhete não foi já usado?
│   └─ Se estado = 'validado': ❌ ERRO "Bilhete já utilizado!"
│
├─ ✓ Sessão é agora (ou próximas 2 horas)?
│   └─ Se hora_sessao < NOW() - 2h: ❌ ERRO "Sessão já passou!"
│   └─ Se hora_sessao > NOW() + 2h: ⚠️ AVISO "Sessão é só em X minutos"
│
├─ ✓ Bilhete não foi cancelado?
│   └─ Se estado = 'cancelado': ❌ ERRO "Bilhete cancelado (reembolsado)"
│
└─ ✓ Assento ainda existe?
    └─ Se sala foi modificada: ❌ ERRO "Sala foi reconfigurada"

RESULTADO FINAL
───────────────

✅ SUCESSO:
├─ Bilhete marcado como "validado"
├─ Imprime: "✅ ENTRADA AUTORIZADA - Bem-vindo!"
├─ Dashboard atualiza: +1 validado
└─ Cliente entra na sala

❌ ERRO:
├─ Sistema mostra motivo específico
├─ Funciona: Consultar gerente
├─ Auditoria: Log completo do erro
└─ Admin pode aprovar entrada manual (override)
```

---

### **5.6 FLUXO DE NOTIFICAÇÃO (Automático)**

```
FASE 1: INSCRIÇÃO (Cliente Portal)
──────────────────────────────────

Cliente vê: "Avatar em Breve"
├─ Clica: "Notifique-me quando em prévenda"
├─ Fornece:
│   ├─ Email: xavier@example.com
│   └─ OU Telefone: 924123456
│
└─ [Inscrever-se]

Sistema:
├─ Cria registro em INSCRICAO_NOTIFICACAO:
│   ├─ inscricao.exibicao_id = NULL (ainda não existe exibição)
│   ├─ inscricao.cliente_id = 123
│   ├─ inscricao.email = xavier@example.com
│   ├─ inscricao.metodo = 'email'
│   ├─ inscricao.data_inscricao = NOW()
│   ├─ inscricao.notificado = FALSE
│   └─ inscricao.link_notificacao = "abc123xyz" (token único)
│
├─ Envia email de confirmação:
│   ┌────────────────────────────────────────┐
│   │ Assunto: Confirme sua inscrição       │
│   │                                        │
│   │ Clique aqui para confirmar:           │
│   │ [https://CINEIZE.ao/confirm/abc123xyz]│
│   │                                        │
│   │ Você será notificado quando Avatar    │
│   │ estiver em prévenda!                  │
│   └────────────────────────────────────────┘
│
└─ ✅ Inscrição pendente

FASE 2: CRIAÇÃO DE EXIBIÇÃO (Admin)
────────────────────────────────────

Admin: Cria exibição "Avatar - Prévenda 1"
├─ tipo = 'prevenda'
├─ data_inicio = 20/09/2024
└─ [Criar]

Sistema:
├─ Cria exibicao.id = 42
└─ Aguarda: Job Cron

FASE 3: JOB CRON (Automático - diário às 08:00)
────────────────────────────────────────────

Job executa às 08:00:

1. Busca TODAS exibicoes onde:
   ├─ data_inicio = TODAY
   ├─ ativa = TRUE
   └─ tipo IN ('prevenda', 'especial', etc)

2. Para cada exibição encontrada:
   ├─ exibicao_id = 42 (Avatar Prévenda)
   │
   ├─ Busca TODAS inscricoes:
   │   ├─ filme_id = Avatar
   │   ├─ notificado = FALSE
   │   ├─ ativa = TRUE
   │   └─ email/telefone preenchido
   │
   ├─ Para cada inscrição:
   │   ├─ Gera email/SMS personalizado
   │   ├─ Inclui link único: [token]
   │   ├─ Envia:
   │   │   ┌──────────────────────────────────┐
   │   │   │ Assunto: Avatar em Prévenda!    │
   │   │   │                                  │
   │   │   │ Olá Xavier!                      │
   │   │   │                                  │
   │   │   │ Avatar está agora em PRÉVENDA!  │
   │   │   │ Preço: 575 kz (Early Bird +15%) │
   │   │   │                                  │
   │   │   │ [Reservar Agora]                │
   │   │   │ https://CINEIZE.ao/reserve/..   │
   │   │   │                                  │
   │   │   │ Oferta válida 48h!              │
   │   │   └──────────────────────────────────┘
   │   │
   │   ├─ Marca: notificado = TRUE
   │   ├─ Registra: data_notificacao = NOW()
   │   └─ Log: historico_notificacoes
   │
   └─ Status final: "Enviadas 342 notificações"

3. Registra auditoria:
   ├─ historico_notificacoes:
   │   ├─ exibicao_id = 42
   │   ├─ inscritos_totais = 342
   │   ├─ notificados_sucesso = 340
   │   ├─ notificados_erro = 2 (email inválido)
   │   ├─ data_execucao = 2024-09-20 08:15
   │   └─ status = 'enviado'
   │
   └─ ✅ Campaña completada

FASE 4: CLIENTE CLICA NO LINK
──────────────────────────────

Cliente recebe email, clica "Reservar Agora"
├─ Link: https://CINEIZE.ao/reserve/abc123xyz
├─ Sistema valida token:
│   ├─ Existe? ✓
│   ├─ Ainda válido? ✓ (48h)
│   └─ Cliente já não se inscreveu? ✓
│
├─ Redireciona para:
│   ├─ Portal cliente
│   ├─ Filme: Avatar
│   ├─ Exibição: "Early Bird - 48h Exclusive"
│   ├─ Sessões disponíveis (pré-selecionadas)
│   └─ Pronto para reservar!
│
└─ ✅ Cliente segue fluxo de compra
   └─ Bilhete gerado (como CENÁRIO A acima)

FASE 5: RELATÓRIO (Admin vê)
────────────────────────────

Admin: "Notificações" → "Avatar Prévenda 1"
├─ Inscritos: 342
├─ Notificados: 340
├─ Taxa de sucesso: 99.4%
├─ Erros: 2
│   ├─ Email 1: "Inválido"
│   └─ Email 2: "Bounce"
│
├─ Cliques no link:
│   ├─ Total: 156 (45.8%)
│   └─ Conversão (bilhetes): 128 (37.4%)
│
├─ Receita desta prévenda: 73,600 kz (128 × 575)
│
└─ [Reenviar para Erros]
   └─ ✅ Reenvio agendado
```

---

## **6. DASHBOARDS & RELATÓRIOS**

### **6.1 DASHBOARD - SUPER ADMIN (Global)**

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN DASHBOARD                    │
└─────────────────────────────────────────────────────────────┘

┌─ CARDS RESUMIDOS (Top Metrics)
│  ├─ 📊 Receita Total (Mês): 25,450,000 kz
│  ├─ 🎫 Bilhetes Vendidos (Mês): 18,500
│  ├─ 📈 Taxa Ocupação Média: 72.3%
│  ├─ 👥 Clientes Novos: 3,240
│  └─ 🏢 Cinemas Ativos: 8
│
├─ GRÁFICO: Receita por Cinema (Bar Chart)
│  ├─ Luanda: 12,500,000 kz
│  ├─ Huambo: 5,200,000 kz
│  ├─ Benguela: 4,300,000 kz
│  ├─ Lobito: 2,100,000 kz
│  └─ Outros: 1,350,000 kz
│
├─ GRÁFICO: Filmes Mais Vendidos (Top 10 - Line Chart)
│  ├─ 1. Avatar 2: 3,450 bilhetes
│  ├─ 2. Oppenheimer: 2,890 bilhetes
│  ├─ 3. Inside Out 2: 2,100 bilhetes
│  └─ ...
│
├─ GRÁFICO: Distribuição por Formato (Pie Chart)
│  ├─ 2D: 35%
│  ├─ 3D: 45%
│  ├─ 4D: 15%
│  └─ MAX: 5%
│
├─ TABELA: Sessões Hoje
│  ├─ Cinema │ Filme │ Horário │ Ocupação │ Receita
│  ├─ Luanda │ Avatar│ 15:00  │ 98/120   │ 56,350
│  ├─ Huambo │ Op'r  │ 20:00  │ 45/100   │ 22,500
│  └─ ...
│
├─ ALERTAS
│  ├─ ⚠️ Sesión lotada: Avatar 20:00 (Luanda)
│  ├─ ⚠️ Ocupação baixa: Indie Film 14:00 (Benguela) - 12%
│  └─ ⚠️ Erro notificação: 2 emails (re-tentar)
│
└─ FILTROS
   ├─ Data: [20/09/2024 ▼]
   ├─ Cinema: [Todos ▼]
   ├─ Película: [Todos ▼]
   └─ [Aplicar]
```

### **6.2 DASHBOARD - GERENTE DE CINEMA**

```
┌─────────────────────────────────────────────────────────────┐
│         GERENTE CINEMA - DASHBOARD (Seu Cinema)             │
└─────────────────────────────────────────────────────────────┘

HEADER
├─ Cinema: "CINEIZE Talatona"
├─ Data: 20 de Setembro, 2024
└─ Período: Mês atual

┌─ CARDS RESUMIDOS (Seu Cinema)
│  ├─ 💰 Receita (Hoje): 485,750 kz
│  ├─ 🎫 Bilhetes (Hoje): 642
│  ├─ 📊 Taxa Ocupação (Hoje): 78.5%
│  ├─ 📈 Receita (Mês): 12,500,000 kz
│  └─ 👥 Novos Clientes (Mês): 1,200
│
├─ GRÁFICO: Receita por Dia (Mês atual - Line Chart)
│  └─ Linha mostrando tendência diária
│
├─ GRÁFICO: Ocupação por Sala (Bar Chart)
│  ├─ Sala 1 (2D): 85%
│  ├─ Sala 2 (3D): 92%
│  ├─ Sala 3 (4D): 65%
│  └─ Sala 4 (MAX): 58%
│
├─ GRÁFICO: Horários Mais Procurados (Heatmap)
│  ├─ Manhã (10-14h): 45 bilhetes
│  ├─ Tarde (14-18h): 120 bilhetes
│  ├─ Noite (18-23h): 477 bilhetes
│  └─ Madrugada (23+): 0 bilhetes
│
├─ TABELA: Sessões Hoje
│  ├─ Horário │ Filme │ Sala │ Assentos │ Receita
│  ├─ 15:00   │ Avatar│ 2(3D)│ 98/120   │ 56,350
│  ├─ 17:30   │ Op'r │ 1(2D)│ 102/150  │ 51,000
│  ├─ 20:00   │ Avatar│ 4(MAX)│ 48/50   │ 72,000
│  └─ 22:00   │ Indie │ 3(4D)│ 15/80    │ 18,000
│
├─ ALERTAS & INSIGHTS
│  ├─ ✅ Dia excelente! +15% vs média
│  ├─ ⚠️ Sala 4 com baixa ocupação (58%)
│  ├─ 💡 Indie Film 22:00: Considere descontar?
│  └─ ⚠️ 23 inscritos para Avatar Prévenda
│
├─ TABELA: Inscrições (Prévenda)
│  ├─ Exibição │ Inscritos │ Notificados │ Ação
│  ├─ Avatar P1│ 450      │ 450        │ [Ver]
│  ├─ Dune P2  │ 230      │ 0          │ [Notificar]
│  └─ ...
│
└─ AÇÕES RÁPIDAS
   ├─ [+ Criar Sessão]
   ├─ [+ Criar Exibição]
   ├─ [Ver Bilhetes]
   └─ [Exportar Relatório]
```

---

## **7. FLUXO DE NOTIFICAÇÃO (Resumo Visual)**

```
TIMELINE:

[Data Hoje]  Data_Prev   Data_Prev   Data_Lancam
   |            |          |            |
   |      [Inscrição]  [Exibição    [Sessões
   |        Cliente    Criada]       Normais]
   |            |          |            |
   ↓            ↓          ↓            ↓
   
   │         │         │         │
   │    [Job 08:00]     │         │
   │      Busca Exib    │         │
   │      com data=hoje │         │
   │         │          │         │
   │         ├─────────→ ✉️ Email │
   │         ├─────────→ 📱 SMS   │
   │         └─────────→ 💬 WhatsApp
   │                     │         │
   │                  [Cliente   [Cliente
   │                   clica]    compra]
   │                     │         │
   │                     └────────→ 🎬 Entrada!
   │
   ✅ Notificado
```

---

## **8. VALIDAÇÕES & REGRAS DE NEGÓCIO**

```
REGRAS DE DATAS:
├─ data_prevenda < data_lancamento (OBRIGATÓRIO)
├─ data_prevenda >= TODAY (não prévenda no passado)
├─ data_sessao > NOW() (sessão no futuro)
└─ data_sessao entre data_prevenda e ... = tipo 'prevenda'

REGRAS DE PREÇO:
├─ preco > 0 (sempre positivo)
├─ preco = preco_base × mult_horario × mult_formato × mult_prevenda
└─ Admin pode override manual

REGRAS DE SESSÃO:
├─ UNIQUE(sala_id, data_hora_inicio) - sem sobreposição
├─ ocupacao_atual <= capacidade
├─ formato_sala != NULL (cada sala tem UM formato)
└─ exibicao_id pode ser NULL (sessão normal)

REGRAS DE BILHETE:
├─ estado: reservado → confirmado → validado → cancelado
├─ UNIQUE(sessao_id, assento_id) - um assento, um bilhete
├─ qr_code UNIQUE
├─ numero_controlo UNIQUE
└─ Não pode validar bilhete após sessão + 2h

REGRAS DE INSCRIÇÃO:
├─ UNIQUE(exibicao_id, cliente_id)
├─ Email OU Telefone preenchido
├─ Metodo válido (email, whatsapp, sms)
└─ notificado após job cron executar
```

---

## **CONCLUSÃO**

```
✅ ARQUITETURA CONSOLIDADA:

├─ Entidade genérica EXIBICAO (polimórfica)
├─ Seleção por FORMATO (não sala)
├─ Preço dinâmico multi-camadas
├─ Datas como fonte de verdade
├─ Roles diferenciados
├─ Fluxos bem definidos
├─ Validações robustas
└─ Escalável e manutenível

🚀 PRONTO PARA:
├─ Criação de interface (frontend)
├─ Desenvolvimento backend (API)
├─ Testes e QA
└─ Deploy em produção
```

---

**Tá fixe agora, Xavier? Esta documentação está blindada, wy!**

Agora sim vamos partir pro próximo passo:
1. **Interface Administrativa** (Dashboard, Forms, etc)
2. **Backend API** (endpoints, lógica de negócio)
3. **Banco de Dados** (scripts SQL)

Qual é o plano? Quer que comece por qual? 🚀