function getDateLog() {
  let today = `${new Date().toLocaleDateString(
    "pt-BR"
  )} - ${new Date().toLocaleTimeString("pt-BR")} `;
  return today;
}

export { getDateLog };
