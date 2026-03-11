export interface TransactionManagerContract {
  readonly purpose: string;
  readonly todo: readonly string[];
}

export const transactionManagerContract: TransactionManagerContract = {
  purpose: "Coordinate multi-write Prisma transactions for domain services.",
  todo: [
    "Add transaction boundary helpers.",
    "Integrate audit writes into critical transactions."
  ]
};
