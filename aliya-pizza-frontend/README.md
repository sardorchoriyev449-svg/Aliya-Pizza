# Aliya Pizza — Frontend

React (Vite) frontend for the Aliya Pizza backend (NestJS).

## Ishga tushirish

```bash
npm install
cp .env.example .env    # kerak bo'lsa VITE_API_URL manzilini o'zgartiring
npm run dev
```

Backend `http://localhost:3000` da ishlab turgan bo'lishi kerak.

## Struktura
- `src/api` — backend bilan aloqa (fetch wrapper, auth, categories, products)
- `src/context` — AuthContext (login/register/logout), CartContext (localStorage'dagi savat)
- `src/components` — Header, ProductCard, CategoryTabs, Footer
- `src/pages` — Home (menyu), Login, Register, Cart, admin/* (admin panel)
