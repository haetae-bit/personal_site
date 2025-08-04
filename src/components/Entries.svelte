<script lang="ts">
  import formatDate from "@/utils/formatDate";
  import { onMount } from "svelte";

  type Entry = {
    id: string;
    name: string;
    website: string | null;
    message: string;
    reply: string | null;
    created_at: string;
    updated_at: string | null;
    approved: "0" | "1";
  }

  async function fetchEntries() {
    const response = await fetch(`http://localhost:8000`);
    const data: Entry[] = await response.json();
    return data;
  }

  const SIZE = 10;
  let entries = $state([] as Entry[]);
  let trimmed = $state([] as Entry[]);

  onMount(async () => {
    const data = await fetchEntries();
    entries = data;
  });

  let totalItems = $derived(entries.length);
  let current = $state(0);
  let totalPages = $derived(Math.ceil(totalItems / SIZE));
  let start = $derived(current * SIZE);
  let end = $derived(current === totalPages - 1 ? totalItems - 1 : start + SIZE - 1);

  $effect(() => {
    trimmed = entries.slice(start, end + 1);
  });
</script>

{#snippet entry(data: Entry)}
  <article class="entry" id={data.id}>
    <header>
      <h1>
        {#if data.website}
          <a href={data.website} target="_blank" rel="noopener noreferrer">{data.name}</a>
        {:else}
          {data.name}
        {/if}
      </h1>
      <time datetime={formatDate(data.created_at, true)}>
        {formatDate(data.created_at, false, 'MMMM D, YYYY [at] hh:mm a')}
      </time>
    </header>

    {data.message}
  </article>

  {#if data.reply}
    <details>
      <summary>See reply to <b>{data.name}</b></summary>
      <article class="entry reply" id={`${data.id}-reply`}>
        <header>
          <h1>Re: {data.name}</h1>
          {#if data.updated_at}
            <time datetime={formatDate(data.updated_at, true)}>
              {formatDate(data.updated_at, false, 'MMMM D, YYYY [at] hh:mm a')}
            </time>
          {/if}
          img
        </header>

        {data.reply}
      </article>
    </details>
  {/if}
{/snippet}

<div class="entries">
  {#each trimmed as item (item.id)}
    {@render entry(item)}
  {/each}

  {#if totalItems && totalItems > SIZE}
    <nav class="pagination">
      <button
        onclick={() => current -= 1}
        disabled={current === 0 ? true : false}
      >
        Previous
      </button>
      {#if totalPages > 2}
        {#if current - 2 > 0} <button onclick={() => current -= 2}>{current -= 2}</button> {/if}
        {#if current - 1 > 0} <button onclick={() => current -= 1}>{current -= 1}</button> {/if}
        {#if current + 1 < totalPages + 1} <button onclick={() => current += 1}>{current -= 1}</button> {/if}
        {#if current + 2 < totalPages + 1} <button onclick={() => current += 2}>{current += 2}</button> {/if}
      {/if}
      <button 
        onclick={() => current += 1}
        disabled={current === totalPages - 1 ? true : false}
      >
        Next
      </button>
    </nav>
  {/if}
</div>

<style>
  .entries {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }

  .entry {
    image-rendering: pixelated;
    font-family: var(--sans-font);
    font-size: calc(1rem * 2);
    letter-spacing: 1px;
    color: var(--speech-fg-color);
    background-color: var(--speech-bg-color);
    border-image: var(--border) 7 / 7px / 7px repeat;
    width: 60ch;

    h1 { font-size: 2rem; }
  }
  
  details {
    align-self: flex-end;

    summary {
      cursor: pointer;
      text-align: right;

      &::marker {
        color: aqua;
      }
    }
    
    &::details-content {
      opacity: 0;
      transition:
        opacity 600ms,
        content-visibility 600ms allow-discrete;
    }

    &[open]::details-content {
      opacity: 1;
    }
  }
</style>