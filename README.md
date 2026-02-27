# EyeLink Freelance - Fitness Gym

**Fitness Gym** is an application to manage member of gym even for company or personal coaching. covering core capabilities including member management, training and diet planning, scheduling, communication, and revenue tracking.


[![nextjs admin template](https://cdn.pimjo.com/nextadmin-2.png)](https://nextadmin.co/)


By leveraging the latest features of **Next.js 16** and key functionalities like **server-side rendering (SSR)**, **static site generation (SSG)**, and seamless **API route integration**, **Fitness Gym** ensures optimal performance. With the added benefits of **React 19 advancements** and **TypeScript** reliability

## Installation

1. Download/fork/clone the repo and Once you're in the correct directory, it's time to install all the necessary dependencies. You can do this by typing the following command:

```
npm install
```
If you're using **Yarn** as your package manager, the command will be:

```
yarn install
```

2. Okay, you're almost there. Now all you need to do is start the development server. If you're using **npm**, the command is:

```
npm run dev
```
And if you're using **Yarn**, it's:

```
yarn dev
```

And voila! You're now ready to start.

## Highlighted Features

- Styling facilitated by **Tailwind CSS** files.
- Support for both **dark mode** and **light mode**.
- Essential integrations including - Authentication (**auth built-in supabase**), Database (**Supabase Postgres**)
- user-friendly.
- Customizable plugins and add-ons.
- **TypeScript** compatibility.

## Tips

- .env.example is an example for .env that we will have:
    - the prefix **NEXT_PUBLIC** is for client side page. it will not work on server side.
    - without prefix means you will handle the value of the .env variable in server side only. it will not work on client side
- Folder:
    - **(public)**: A route group for pages that do NOT require authentication. in the url it will be /sign-in not public/sign-in 
    - **(app) or (protected)**: protected application area. Uses the protected layout, Requires authentication.
    - **api**: This is your server-call API layer (server page). Contains all endpoints server app/api/**/route.ts. Those Route Handlers use lib/supabase/server.ts to run Supabase queries securely. 
    - **lib**: It is NOT routing. It is NOT UI. it contains Supabase client, DB query helpers, Validation schemas, Utility functions, Business logic
    - **lib/validation**: Zod schemas. used in API validation and Forms.
    - **lib/auth/**: Role-based logic. Permission helpers. Workspace checks.
    - **src/components/**: all reusable UI components. should not contains business logic, supabase call

