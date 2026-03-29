import { deletePost } from '@/app/actions/posts'
import type { Post, Resort } from '@/lib/types'

type PostWithResort = Post & { resort: Resort | null }

type Props = {
  posts: PostWithResort[]
  isOwner?: boolean
}

export function PostList({ posts, isOwner }: Props) {
  if (posts.length === 0 && !isOwner) return null

  return (
    <section>
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        網誌{posts.length > 0 ? ` · ${posts.length} 篇` : ''}
      </h2>

      {posts.length === 0 && (
        <p className="text-sm text-slate-600 mb-3">尚未發布任何網誌</p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            {post.image_urls.length > 0 && (
              <div className="flex gap-1 overflow-x-auto">
                {post.image_urls.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="h-48 w-auto object-cover flex-shrink-0 first:rounded-tl-xl last:rounded-tr-xl"
                  />
                ))}
              </div>
            )}
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {post.title && (
                    <p className="font-semibold text-white text-sm mb-1">{post.title}</p>
                  )}
                  {post.resort && (
                    <p className="text-xs text-blue-400 mb-1">
                      {post.resort.name_zh ?? post.resort.name}
                    </p>
                  )}
                  {post.content && (
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  )}
                </div>
                {isOwner && (
                  <form action={deletePost.bind(null, post.id)} className="shrink-0">
                    <button type="submit" className="text-xs text-slate-600 hover:text-rose-400 transition-colors">
                      刪除
                    </button>
                  </form>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                {new Date(post.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
