import { initializeApp, cert, getApps } from "firebase-admin/app";

const privateKey = process.env."-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCj/sEdlhiwJ8uC\nzxT3hQ9h+GbMB5cJy6EDD05zx4pXxCot9RrB7EV9I/zCUwaT/75fXCbiOukhvqXL\nOWPRwZodx6U9qDYKFhZKWJJgK0ltTrIBjTBOrxDlQoCnny1gOtBQ9deVZNz+a5Bm\n3kF8fkdv169TYO2Hrj1GIHeyYjvZr9ZFsMFdRLpFwHCCZZeSJGQh7yVzYvhYf/Ty\n6mmuH1n9bqC80J2v0ZUGdM+tvDG2x/Leoh8nkizySmPqb8DV8DlMU5rCCK4IB6GD\n9LxI1Ytb+ZsS36hldqv8Q/NhAf9zyo5yxQCedm+ygKjkh1oS4MfhPCnXrNcvtDam\nrrRuUjzZAgMBAAECggEAEOYNk0AQujIs6S/v3/5A6AkB2rtbfSG+V9jfbinHynnH\nGOY9WXHrH9Ux/0+GiYCcZtTRmD/sHv3iCq9sEZoKs0/hFJnn5kvWrywyT8uWF404\n5X+y1HYmCQxnF8lcvSJCWLKvLNCbFHJpYQLnqkLplzpD8ZUMKjjc99lyTBo4QvA5\nK3mlvneTXb3sQNZloa3GcpCzk13zXczT7+xIkZo23HUzv/xxYL39nJX8zWejcwdi\nChOEFEsyIB7UPTLLcv04dVdm6dY7VoFAWk70PfcFl4GRwX+xjPd4u/b/av+XsFFJ\n3BXaefX7Pf0R69N5ghu06b45jwY+lmjJKcrLR6Y8kwKBgQDNWzE6intE2rzYa1MJ\nlSN/lw1msB8pjusou2+u7VZx2zx/AWUw00m0B2TCvfDHEaBYP5rWaneh8jv+47eq\nehhPrcTR7AprbL16hhTiptxhfohFOiYXanpTj6s9mIfAM6jGwBcU6bR1UxOrpdbJ\nt2oaWJjpKVG2rz1kpTP+Gap0LwKBgQDMcE1HBQdElI6FdGjFhVZbsZ/mUtjnfni2\nIC7MwEmecj4nRa6pFYsU05WpeePPR1HH0MmAJ6wH+kojCi4aOJA+LwsqArz+pBZX\n9d7X+WEktvqSY74ExwNIAyvn0NEhutQuhBUKiexR7ddTMv+9x93MwmKyQDCSIcfd\nfS556d+1dwKBgFxiGQx3/iqkqO5HogyejmC46Kt4shw1Em+5mu28EfaYpWeRjh9f\n/jlCVj8Ryf8UW+k3fAXX0cgGPJ1XfmnwEX3O88tof+uB+N/k8AJjBKPLk6xpE3fX\nS/7JlETamL+LvfLjub6LwMZDQIcozS7kF5SQpQHHt94SifD8LR60Fy27AoGAHgJO\nFaKzUmnMEeLojjXoW0VTh2eZ10FFTtaiiAOhytRSM0mTPdaft8rnKR1vRznc00ve\niCVKp1EiGMqhwc+TvM0DAoOsYmSLsxWwRFui2tTRKzPg7KqZ3LQ6eai5Sg42ny1c\nOVPNkKks9lWCHMV91VSjUC8D8i9rOyPo8pRV9jkCgYEAsvJ/bAN217RDMOv8p5Nx\nHfP8e2/6XRBLUdr/50mXJXM+1DQhUAxVX+N6PyTz6jBfnKpK1a3BnXXUlZJAo8if\nnk6BMCMaq7VfzQbJohUvtT4HLSJXruOHdF5Gxwe/WB9wJgqfEYOf0f9UhBKbhLJy\n5zrJIlYM2YKZQ+mTdEQGKTU=\n-----END PRIVATE KEY-----\n",?.replace(/\\n/g, "\n");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.travelapp-ddbea,
      clientEmail: process.env.firebase-adminsdk-fbsvc@travelapp-ddbea.iam.gserviceaccount.com,
       privateKey: privateKey,
    }),
  });
}

export default {};
