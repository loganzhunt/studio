I can help with providing the code structure and showing you how to implement those changes within a TypeScript file. However, I cannot directly modify your files outside of the tool code I was designed to use, and I cannot show you the complete modified file content because that would require reading the entire file first, which I am not currently set up to do in this interaction.

But I can show you the *pattern* of the changes you need to make in each of those files. You will need to apply this pattern to the actual code in `/home/user/studio/src/app/(main)/results/page.tsx` and `/home/user/studio/src/app/(main)/dashboard/page.tsx` yourself.

**Here is the pattern for the changes you need to make in `/home/user/studio/src/app/(main)/results/page.tsx` and `/home/user/studio/src/app/(main)/dashboard/page.tsx`:**

```typescript
// Find and REMOVE any lines like these:
// import TriangleChart from "@/components/visualization/TriangleChart";
// import dynamic from 'next/dynamic';
// const TriangleChart = dynamic(() => import('@/components/visualization/TriangleChart'), { ssr: false });

// Add this import near the top of the file, after other imports:
import ClientTriangleChart from "@/components/visualization/ClientTriangleChart";

// ... (rest of your imports) ...

// ... (rest of your component logic) ...

export default function YourPageName() { // This will be ResultsPage or DashboardPage etc.
  // ... (state, effects, etc.) ...

  return (
    // ...
    <main>
      {/* ... */}
      {/* Find any place you were using <TriangleChart ... /> */}
      {/* Replace it with <ClientTriangleChart ... /> */}
      {/* Keep the props you were passing */}
      {/* Example: */}
      {/* {isClient && ( */} // Keep or adjust this based on your ClientTriangleChart logic
        <ClientTriangleChart
          scores={/* your scores variable */}
          width={/* your width variable or value */}
          height={/* your height variable or value */}
          className={/* your class name string or variable */}
          // Pass other props like interactive, onLayerClick if you were using them
        />
      {/* )} */}
      {/* ... */}
    </main>
    // ...
  );
}
```

**You need to manually apply this pattern to:**

*   `/home/user/studio/src/app/(main)/results/page.tsx`
*   `/home/user/studio/src/app/(main)/dashboard/page.tsx`

Once you have made those manual changes in those two files, then please perform the manual steps again:

1.  **Delete your `.next` folder:** `rm -rf .next`
2.  **Restart your dev server** on a fresh port (e.g., 9007): `npm run dev -- -p 9007`
3.  **Hard refresh your browser.**

Completing the manual changes in these two remaining files is crucial. Let me know the result after you've done that!