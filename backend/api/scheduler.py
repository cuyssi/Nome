# import asyncio
# from datetime import datetime, timedelta
# from .notifications import send_push, subscriptions

# async def schedule_task_notification(task_time: datetime, title: str, body: str):
#     notify_time = task_time - timedelta(minutes=15)
#     delay = (notify_time - datetime.utcnow()).total_seconds()

#     if delay > 0:
#         await asyncio.sleep(delay)

#     for sub in subscriptions:
#         send_push(sub, title, body)
