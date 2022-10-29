/*
    Douban Movie Add-ons for Surge by Neurogram

        - 豆瓣电影移动版网页增强
        - 快捷跳转 茶杯狐 搜索
        - 展示在映流媒体平台
        - 快捷收藏电影至 Airtable

    使用说明

        [Script]
        // 茶杯狐、流媒体
        http-response ^https://m.douban.com/movie/subject/.+ script-path=Douban.js,requires-body=true,max-size=307200

        // Airtable 收藏
        http-request ^https://m.douban.com/movie/subject/.+\?seen=\d script-path=Douban.js

        [MITM]
        hostname = m.douban.com

        收藏功能，需自行修改代码，点击 想看 / 看过 触发收藏
   
    Author:
        Telegram: Neurogram
        GitHub: Neurogram-R
*/

let url = $request.url
let movieId = url.match(/\d+(?=\/(mark|done))/)
let seen = url.match(/(mark)/)? '0':'1'
let collect = true  //收藏功能，默认关闭，需自行配置
let region = "US" //流媒体区域
let tmdb_api_key = "55dcc15aae83ec3b9e03b76ff5b03656" // TMDB API KEY
$.PROVIDERS_KEY = 'Neurogram_DouBan_provider'
$.providers = JSON.parse($.getdata($.PROVIDERS_KEY) || '[]')
collect_movie()

async function collect_movie() {
    let options = {
        url: `https://frodo.douban.com/api/v2/movie/${movieId[0]}?apiKey=0ac44ae016490db2204ce0a042db2916`,
        headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.3(0x18000323) NetType/WIFI Language/en",
            "Referer": "https://servicewechat.com/wx2f9b06c1de1ccfca/82/page-frame.html"
        }
    }

    let douban_result = await send_request(options, "get")

    if (douban_result.msg == "movie_not_found") {
        $done({ url: url.replace(/\?seen=\d/, "") })
    }

    let casts = ""
    for (var i = 0; i < douban_result.actors.length; i++) {
        casts = casts + douban_result.actors[i].name + " / "
    }
    let directors = ""
    for (var k = 0; k < douban_result.directors.length; k++) {
        directors = directors + douban_result.directors[k].name + " / "
    }
    let title = douban_result.title + "  " + douban_result.original_title
      $notification.post('豆瓣电影', douban_result.year, "");
    let table = {
        url: "https://api.airtable.com/v0/appUy2QeCdkMGnKY1/Douban",
        headers: {
            Authorization: "Bearer key9wUh99ucoMFxfr"
        },
        body: {
            records: [
                {
                    "fields": {
                        "Title": title,
                        "Description": douban_result.intro,
                        "Poster": [
                            {
                                "url": douban_result.pic.large
                            }
                        ],
                        "Seen": seen == 1 ? true : false,
                        "Actors": casts.replace(/\s\/\s$/, ""),
                        "Director": directors.replace(/\s\/\s$/, ""),
                        "Genre": douban_result.genres.toString(),
                        "Douban": "https://movie.douban.com/subject/" + movieId[0],
                        "Rating": douban_result.rating.value,
                        "Year": parseInt(douban_result.year)
                    }
                }
            ]
        }
    }

    let airtable_collect = await send_request(table, "post")

    if (!airtable_collect.records) {
        $notification.post('收藏失败', airtable_collect.error.type, airtable_collect.error.message);
        $done({ url: 'https://movie.douban.com/subject/" + movieId[0]'})
    }

    $notification.post('豆瓣电影', title + " 收藏成功", "");
    $done({ url: 'https://movie.douban.com/subject/" + movieId[0]'})
}

function send_request(options, method) {
    return new Promise((resolve, reject) => {

        if (method == "get") {
            $httpClient.get(options, function (error, response, data) {
                if (error) return reject('Error')
                resolve(JSON.parse(data))
            })
        }

        if (method == "post") {
            $httpClient.post(options, function (error, response, data) {
                if (error) return reject('Error')
                resolve(JSON.parse(data))
            })
        }
    })
}
