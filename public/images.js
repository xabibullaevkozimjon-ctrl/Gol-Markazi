// =====================================================================
//  50 TA MAYDON RASMI
//  Rasmni almashtirish uchun kerakli qatorni o'zgartiring va sahifani
//  yangilang (Ctrl+Shift+R). Ikki xil yozish mumkin:
//
//  1) Fayl:   'img/fields/field-1.jpg'
//             (rasmni img/fields papkasiga qo'ying va nomini shu yerga yozing,
//              masalan:  'img/fields/mening-rasmim.jpg')
//  2) Havola: 'https://sayt.com/rasm.jpg'   (internet kerak)
//
//  Tartib: 1-qator = 1-maydon, 2-qator = 2-maydon ... 50-qator = 50-maydon.
//  Eslatma: qabul qiluvchi panelidan rasm almashtirilgan bo'lsa, o'sha rasm ustun turadi.
// =====================================================================
window.MAYDON_IMAGES = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_sqm_UD1sFeeG78BXBG7b2dwnqGMozW6IWaCLLFuNyw&s=10', // 1 - Bunyodkor Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa1segX14Cxzu6AumJHtHxTtzPdfw-0zssqNUsaJ1z-A&s=10', // 2 - Yashil Vodiy
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4LWvF4Mbz-Yi1tYZ00ZasK3h0aYV5ZOmEDVvroFgXIA&s=10', // 3 - Sport Plus
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfr9LLHgVmjpJO0H8BBYiDOszuKZAhA1u4syYyJaMVrA&s=10', // 4 - Paxtakor Maydoni
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaP6koMXny_nQjtQ4YkKLboxP-V0NxtB89Bx5mFrBV8w&s=10', // 5 - Olimp Stadion
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Ia3SsAF6e3Q9T28NVbnaa0eoA3yXLTzyUfZ6dNBwUw&s', // 6 - Navbahor Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS4E6tfZ4L8Mh7DdZY9-zLHpQ-ei7hKTl3jQg9x8nIUA&s=10', // 7 - Chempion
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHEjNZJGVKEkIdShJf8UNKtmHPwOGuRx6m5b6XhjG-vQ&s=10', // 8 - Yulduz Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9S1sVdIceMyD3e5-AoYtXt95bNGmyfA5v8lKJoJ17hw&s=10', // 9 - Neftchi Maydon
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTozGZRNTBP6RFQngb4B7LiqvgOJCGIICy5p8m80KRHrQ&s=10', // 10 - Sogdiana
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5bgRVxto6HOMC4XPwYQqmrensEKmEiJgoEUblPK8Ymg&s=10', // 11 - Mash'al
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbJmkbgBMX846h_TO9N03_X-2Ug97gg7vTYQSx-gSnqg&s=10', // 12 - Lokomotiv Plus
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5bgRVxto6HOMC4XPwYQqmrensEKmEiJgoEUblPK8Ymg&s=10', // 13 - Registon
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEBuDKv09TbAXAdDJtdZCA0LnroGI8wLx5j23Jix23zg&s=10', // 14 - Dinamo Park
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0muOr-0euaLEop-ev6LMgzFhkUwHSu2kQHWELnF92dg&s', // 15 - Metallurg
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHkHzncdtWvOGmA8lfU5UMzoAC3g7BePTHcfFGUD6ikA&s=10', // 16 - Qo'rg'on Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRshZHS5lvOnj2mUbXYVOGkdNkSvq4CsBihMqkTGKAulg&s=10', // 17 - Temur Stadion
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcANEQl7Iti9FRgjGY8UgvM_-O4hNC4PjK3FqyHZVmbg&s=10', // 18 - Zafar Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQInw8q839_QEkuW6GziE3Y6IarJ6kgZJHo-4GuEXzoLA&s=10', // 19 - Humo Maydon
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjwlWfBu_MtxueqjeZBBC-lbx9zBmPp-FPhz4R_AC5xw&s=10', // 20 - Orzu Sport
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH-rChiI0jVPsVaNVM6wADQPH6VRjlv-ZGjWJNMGv7kQ&s=10', // 21 - Baraka Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDPVHmwxVsigmkrUMLtjJKm-4zDY-2Zwz9CkmyZwOd3g&s=10', // 22 - Oltin To'p
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8ekXSZzO6Fvmq-mSnexMqmpchue-mu7uX8r5NmEgOjw&s', // 23 - Gold Field
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-7Tkb83a5pWSh19e_VuSrS4Ni8ogZzMd5rKvbPC3cpA&s', // 24 - Premier Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsOvTOr2o1kx-tNFBVySvflO0EDd1MwnKWQnW_wpb_Ng&s=10', // 25 - Jasur Stadion
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7wtENyUmByl-gZhUcjGgpnUcgsqI8vjHzlP3AhTSMZQ&s=10', // 26 - Alpomish
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsOJMTSjS5Ypm6delay0Mqe4mcC6Qal_KzRQC8dpDOBw&s=10', // 27 - Sardor Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwJpT0Z-6YjgESCNJxgZEjCL1BLR-B99YYxqrv1V4pPg&s=10', // 28 - Turon Maydon
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRffP7D8FWy5Tfe9LIGh7qbeSCJPONZYaAXXTsjHPxsvQ&s', // 29 - Nur Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSibGYdQpLVB6ldHumnN3BLCvH98WkRPNVOOsco77INLw&s=10', // 30 - Kamolot
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTEiKiKWJvnGclSeZgunNOqI6kvk-g59jImBpx8Yyj9g&s=10', // 31 - Vatan Stadion
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-cSfzQR-9fv86OgrG7xzyuhPiRv7Yz-P5PjnqAQVCZg&s=10', // 32 - Mehnat Maydoni
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNBZFcD1jWBbKwhl0hR5krHRfKvn0tB4csytKk3dOa0w&s=10', // 33 - Shodlik Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD9uZCecBI7hi0DfqIMETSqiEjyHUC8e9HUJ1Dwy3ztA&s=10', // 34 - Istiqlol
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZaRjWoBiyfLEVElu2ildjAhEAbgz_xpXMuPx338k9zw&s=10', // 35 - Bahor Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQthrOdyjDc6819SLmt_iGeTGx3WtLR8uWS3hzBDYsRvA&s=10', // 36 - Zamin Sport
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI9FSXwCE2W3kdA-FCMjpBMH1_NyPxwEuKrnblaB0xAw&s=10', // 37 - Do'stlik
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF3wKEs1fjzcvaCrDgVhq7ZjcronnbNGhfqw3y1zqMbg&s=10', // 38 - Sher Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 39 - Oqtepa Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 40 - Ko'k Maydon
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 41 - Granit Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 42 - Marvarid
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 43 - Sharq Stadion
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 44 - G'alaba
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 45 - Vodiy Star
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 46 - Samarqand Arena
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 47 - Buxoro Star
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 48 - Namangan Park
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 49 - Andijon Sport
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJzmBylIWo79kqY0t-0uh5uCGVdrheC5qPiVYcHrzZg&s=10', // 50 - Qarshi Arena
]
