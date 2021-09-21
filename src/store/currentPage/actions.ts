
export const changeRoute = (currentPage: string) => ({
  type: 'CHANGE_ROUTE',
  payload: { pageName: currentPage },
});
