const worker = new Worker(new URL('./sw.ts', import.meta.url), { type: 'module' })

worker.onerror = (error) => {
  console.error('Worker error:', error)
}

export { worker }