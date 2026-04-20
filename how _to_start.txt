PS D:\Projects\CD> cd tests
PS D:\Projects\CD\tests> .\create-bot.ps1 -DslFile "fashion-bot.dsl"
====================================
DSL Compiler
====================================
Compiling: fashion-bot.dsl
Sending request...

âœ… SUCCESS!
Bot ID: bot_42046436_mlvc0pmm
Intents: 2
Keywords: 10
PS D:\Projects\CD\tests>

and 

npm start

nahip@Vaishnavi_PC MINGW64 /d/projects/CD/tests (main)
$ curl -X POST http://localhost:5000/api/bots \
  -H "Content-Type: application/json" \
  -H "x-api-key: test123" \
  -d '{
    "dsl": "bot FashionBot\ndomain ecommerce\ntone friendly\n\nwelcome \"Welcome!\"\n\nintent check_order\nkeywords: order status\nresponse \"Your order is shipped\"\n\nfallback \"Try again\""
  }'
nahip@Vaishnavi_PC MINGW64 /d/projects/CD/tests (main)
$ curl http://localhost:5000/api/bot/bot_90ce35cb_mn3k6ltj
{"success":false,"error":"Internal server error"}
nahip@Vaishnavi_PC MINGW64 /d/projects/CD/tests (main)
$ curl -X POST http://localhost:5000/api/chat/bot_90ce35cb_mn3k6ltj   -H "Content-Type: application/json"   -d '{"message":"order status"}'
{"success":true,"response":"Your order is shipped"}
nahip@Vaishnavi_PC MINGW64 /d/projects/CD/tests (main)
$ curl http://localhost:5000/api/bot/bot_90ce35cb_mn3k6ltj
{"success":true,"bot":{"id":"bot_90ce35cb_mn3k6ltj","name":"FashionBot","metadata":{"domain":"ecommerce","tone":"friendly","created_at":"2026-03-23T19:08:22.903Z","version":"1.0"},"welcome":"Welcome!","fallback":"Try again"}}