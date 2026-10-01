export const dataErrorMessages = {
  unsupported:
    'Este ativo não está disponível no acesso sem token. Nesta etapa, consulte PETR4, VALE3, ITUB4 ou MGLU3.',
  network:
    'Não foi possível consultar a fonte. Verifique sua conexão e tente novamente.',
  timeout: 'A consulta demorou além do limite. Tente novamente.',
  auth: 'A fonte exige autenticação ou um plano diferente para esta consulta.',
  'rate-limit':
    'A fonte limitou as consultas. Aguarde o prazo informado antes de tentar novamente.',
  'invalid-response':
    'A fonte retornou dados em um formato inesperado. Tente novamente mais tarde.',
  server: 'A fonte está indisponível no momento. Tente novamente mais tarde.',
}
