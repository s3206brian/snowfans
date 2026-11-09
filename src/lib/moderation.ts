/**
 * Notifies moderators when a user reports or blocks someone, so reports can be
 * acted on within 24 hours (App Store Guideline 1.2).
 *
 * Set MODERATION_WEBHOOK_URL to a Mattermost / Slack-compatible incoming webhook.
 * Without it, reports still land in the `reports` table and this is a no-op.
 */
export async function notifyModerators(text: string): Promise<void> {
  const url = process.env.MODERATION_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, username: 'SnowFans Moderation' }),
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    // 通知失敗不影響使用者操作；檢舉紀錄已寫入資料庫
  }
}
