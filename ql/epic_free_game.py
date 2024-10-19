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
    api_url = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN&allowCountries=CN'

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
            game['store_url'] = f"{base_store_url}/p/{element['catalogNs']['mappings'][0]['pageSlug']}" if element[
                'catalogNs']['mappings'] else f"{base_store_url}/bundles/{element['urlSlug']}"

            # 处理当前的免费游戏
            if offers := promotions['promotionalOffers']:
                promo_offer = offers[0]['promotionalOffers'][0]
                if promo_offer['discountSetting']['discountPercentage'] == 0:
                    game['start_date'] = promo_offer['startDate']
                    game['end_date'] = promo_offer['endDate']
                    games['free_now'].append(game)

            # 处理即将到来的免费游戏
            if upcoming_offers := promotions['upcomingPromotionalOffers']:
                for offer in upcoming_offers:  # 遍历所有即将到来的促销
                    for promo_offer in offer['promotionalOffers']:  # 遍历每个促销
                        if promo_offer['discountSetting']['discountPercentage'] == 0:  # 检查是否免费
                            game['start_date'] = promo_offer['startDate']
                            game['end_date'] = promo_offer['endDate']
                            games['free_next'].append(game)
                            break  # 找到免费游戏后跳出，处理下一个游戏
    return games


def main():
    games = get_free_games()
    if not games['free_now'] and not games['free_next']:
        print("未获取到任何免费游戏信息")
        send("Epic免费游戏获取警告", "未获取到任何免费游戏信息")
        return

    message = ""
    if games['free_now']:
        message += "本周免费:\n"
        for game in games['free_now']:
            game_info = f"{game['title']}\n原价: {game['origin_price']}\n{game['store_url']}\n"
            print(game_info)
            message += game_info + "\n"

    if games['free_next']:
        message += "下周免费:\n"
        for game in games['free_next']:
            game_info = f"{game['title']}\n原价: {game['origin_price']}\n{game['store_url']}\n"
            print(game_info)
            message += game_info + "\n"

    send("Epic免费游戏更新", message.strip())


if __name__ == "__main__":
    main()
