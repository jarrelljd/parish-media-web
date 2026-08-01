Drop the real ebook here as:

    social-media-for-catholic-churches.pdf

This exact filename is what `src/app/actions.ts` (`submitEbookRequest`) reads
to attach to the free-guide email, and what
`src/components/FreeGuideForm.tsx`'s "Download Now" button links to. Until
the real file is here, free-guide form submissions will show a friendly
error instead of sending.
