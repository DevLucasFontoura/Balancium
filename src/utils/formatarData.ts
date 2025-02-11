export function formatarData(dataString: string) {
  const data = new Date(dataString);
  // Ajusta o timezone adicionando o offset local
  const dataAjustada = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dataAjustada);
} 