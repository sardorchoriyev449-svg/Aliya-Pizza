kelgan joyimiz:
```
Telegram ulash kerak xozir u yaxshi ulanmagan pnpm add telegraf o'rnatib qilish kerak va xozir masalan kuryer yetkazib berdimi yoqmi yoki user zakazni oldimi yoqmi biz bilmaymiz shuning uchun kuryer telegramdan kuryer registerdan o'tadi va unga kegan zakazlarni u yetkazib bergandan so'ng telegramda buyirtmachini ismi va manzili va locali turadi va tugma turadi "yetkazildi" <-- bu degani kuryer yetkazdi shu xatoni to'girlash kerak: [Nest] 11836  - 07/28/2026, 1:37:07 PM   ERROR [ExceptionsHandler] MongoServerError: Regular expression is invalid: quantifier does not follow a repeatable item
    at Connection.sendCommand (C:\Users\sardo\OneDrive\Рабочий стол\Aliya Pizza\beckend\node_modules\mongodb\src\cmap\connection.ts:561:17)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async Connection.command (C:\Users\sardo\OneDrive\Рабочий стол\Aliya Pizza\beckend\node_modules\mongodb\src\cmap\connection.ts:634:22)
    at async Server.command (C:\Users\sardo\OneDrive\Рабочий стол\Aliya Pizza\beckend\node_modules\mongodb\src\sdam\server.ts:351:21)
    at async executeOperationWithRetries (C:\Users\sardo\OneDrive\Рабочий стол\Aliya Pizza\beckend\node_modules\mongodb\src\operations\execute_operation.ts:266:24)
    at async executeOperation (C:\Users\sardo\OneDrive\Рабочий стол\Aliya Pizza\beckend\node_modules\mongodb\src\operations\execute_operation.ts:127:12)
    at async FindCursor._initialize (C:\Users\sardo\OneDrive\Рабочий стол\Aliya Pizza\beckend\node_modules\mongodb\src\cursor\find_cursor.ts:92:22)
    at async FindCursor.cursorInit (C:\Users\sardo\OneDrive\Рабочий стол\Aliya Pizza\beckend\node_modules\mongodb\src\cursor\abstract_cursor.ts:916:21)
    at async FindCursor.fetchBatch (C:\Users\sardo\OneDrive\Рабочий стол\Aliya Pizza\beckend\node_modules\mongodb\src\cursor\abstract_cursor.ts:954:7)
    at async FindCursor.next (C:\Users\sardo\OneDrive\Рабочий стол\Aliya Pizza\beckend\node_modules\mongodb\src\cursor\abstract_cursor.ts:572:9) {
  errorLabelSet: Set(0) {},
  errorResponse: {
    ok: 0,
    errmsg: 'Regular expression is invalid: quantifier does not follow a repeatable item',
    code: 51091,
    codeName: 'Location51091'
  },
  ok: 0,
  code: 51091,
  codeName: 'Location51091'
} ,.
```