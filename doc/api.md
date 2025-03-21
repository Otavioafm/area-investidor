# Documentação da API

## Autenticação

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "investor|startup"
}
```

## Startups

### Listar Startups
```http
GET /api/startups
Authorization: Bearer {token}
```

### Detalhes da Startup
```http
GET /api/startups/:id
Authorization: Bearer {token}
```

### Criar Startup
```http
POST /api/startups
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "string",
  "category": "string",
  "description": "string",
  "investment": "number",
  "equity": "number"
}
```

## Investimentos

### Realizar Investimento
```http
POST /api/investments
Authorization: Bearer {token}
Content-Type: application/json

{
  "startupId": "string",
  "amount": "number",
  "equity": "number"
}
```

## Segurança
- JWT para autenticação
- Rate limiting
- Validação de inputs
- CORS configurado
