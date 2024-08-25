"""
cron: 10 8 * * 5
new Env('Epic免费游戏');
根据 https://github.com/Cat-Zhua/Epic-Weekly-Free-Games 改编所得
author: Zz1xuan

"""

import requests
from datetime import datetime
from sendNotify import send


def get_free_games() -> dict:
    timestamp = datetime.timestamp(datetime.now())
    games = {'timestamp': timestamp, 'free_now': [], 'free_next': []}
    base_store_url = 'https://store.epicgames.com'
    api_url = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN'

    try:
        resp = requests.get(api_url)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"请求API失败: {str(e)}")
        send("Epic免费游戏获取失败", f"请求API失败: {str(e)}")
        return games

    for element in resp.json()['data']['Catalog']['searchStore']['elements']:
        if promotions := element['promotions']:
            game = {}
            game['title'] = element.get('keyImages', [{}])[
                0].get('title', element['title'])
            game['origin_price'] = element['price']['totalPrice']['fmtPrice']['originalPrice']
            game['store_url'] = f"{base_store_url}/p/{element['catalogNs']['mappings'][0]['pageSlug']}" if element['catalogNs']['mappings'] else base_store_url
            if offers := promotions['promotionalOffers']:
                game['start_date'] = offers[0]['promotionalOffers'][0]['startDate']
                game['end_date'] = offers[0]['promotionalOffers'][0]['endDate']
                games['free_now'].append(game)
            if offers := promotions['upcomingPromotionalOffers']:
                game['start_date'] = offers[0]['promotionalOffers'][0]['startDate']
                game['end_date'] = offers[0]['promotionalOffers'][0]['endDate']
                games['free_next'].append(game)
    return games


def main():
    games = get_free_games()
    if not games['free_now'] and not games['free_next']:
        print("未获取到任何免费游戏信息")
        send("Epic免费游戏获取警告", "未获取到任何免费游戏信息")
        return

    message = ""
    for game in games['free_now']:
        game_info = f"{game['title']}\n原价: {game['origin_price']}\n{game['store_url']}\n"
        print(game_info)
        message += game_info + "\n"

    message += "\n下周免费:\n"
    for game in games['free_next']:
        game_info = f"{game['title']}\n原价: {game['origin_price']}\n{game['store_url']}\n"
        print(game_info)
        message += game_info + "\n"

    send("Epic免费游戏更新", message.strip())


if __name__ == "__main__":
    main()
