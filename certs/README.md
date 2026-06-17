# Certificados locais

Este diretório deve conter os certificados gerados com `mkcert` para o host `cortaai.local`.

Passos básicos:

1. Instale o `mkcert` e rode `mkcert -install`.
2. Gere o certificado com `mkcert cortaai.local`.
3. Mantenha os arquivos gerados com estes nomes, porque o Nginx espera exatamente:
   - `cortaai.local.pem`
   - `cortaai.local-key.pem`
4. Adicione no arquivo `hosts` do sistema:
   - `127.0.0.1 cortaai.local`

Os arquivos devem ficar neste diretório ao lado do `docker-compose.yml`.
