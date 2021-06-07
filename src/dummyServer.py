import random as rand
import time
from datetime import datetime

NUM_SECONDS_SLEEP = 1

months = {'F' : 0, 'G' : 1, 'H' : 2, 'J' : 3, 'K' : 4, 'M' : 5,
          'N' : 6, 'Q' : 7, 'U' : 8, 'V' : 9, 'X' : 10, 'Z' : 11}

roots = [   "ZS","ZM","ZL","ZC","ZW","ZO","GF","LE","HE","LBS",
            "CL","NG","RB","HO",
            "GC","SI","HG","PL",
            "DX","6E","6J","RMB","6B","6C","6A","6L","6M",
            "ZT","Z3N","ZF","ZN","TN","ZB","ES","YM","NQ","RTY",
            "BTC","ETH"
        ]
root_months = { 'ZS':  ["F","H","K","N","Q","U","X"],
                'ZM':  ["F","H","K","N","Q","U","V","Z"],
                'ZL':  ["F","H","K","N","Q","U","V","Z"],
                'ZC':  ["H","K","N","U","Z"],
                'ZW':  ["H","K","N","U","Z"],
                'ZO':  ["H","K","N","U","Z"],
                'GF':  ["F", "H", "J", "K", "Q", "U", "V", "X"],
                'LE':  ["G", "J", "M", "Q", "U", "V", "Z"],
                'HE':  ["G", "J", "K", "M", "N", "Q", "V", "Z"],
                'LBS': ["F", "H", "K", "N", "U", "V"],
                'CL':  ['F','G','H','J','K','M','N','Q','U','V','X','Z'],
                'NG':  ['F','G','H','J','K','M','N','Q','U','V','X','Z'],
                'RB':  ['F','G','H','J','K','M','N','Q','U','V','X','Z'],
                'HO':  ['F','G','H','J','K','M','N','Q','U','V','X','Z'],
                'GC':  ["G","J","M","Q","V","Z"],
                'SI':  ["H","K","N","U","Z"],
                'HG':  ["H","K","N","U","Z"],
                'PL':  ["F","J","N","V"],
                'DX':  ['M'],
                '6E':  ['M'],
                '6J':  ['M'],
                'RMB': ['M'],
                '6B':  ['M'],
                '6C':  ['M'],
                '6A':  ['M'],
                '6L':  ['M'],
                '6M':  ['M'],
                'ZT':  ['M'],
                'Z3N': ['M'],
                'ZF':  ['M'],
                'ZN':  ['M'],
                'TN':  ['M'],
                'ZB':  ['M'],
                'ES':  ['M'],
                'YM':  ['M'],
                'NQ':  ['M'],
                'RTY': ['M'],
                'BTC': ['M'],
                'ETH': ['M'],
            }

def getCurMo():
    m = datetime.now().strftime("%m")
    return int(m) if m[0] != '0' else int(m[1])

def getSymbol(cur_root):
    cur_months = root_months.get(cur_root)
    rand_month = cur_months[rand.randint(0, len(cur_months)-1)]
    if months.get(rand_month) >= getCurMo():
        return str(cur_root + rand_month + '1')
    else:
        return str(cur_root + rand_month + '2')
    

while 1:
    date = f'"date": "{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}", '
    r = roots[rand.randint(0, len(roots) - 1)]
    root = f'"root": "{r}", '
    sesh = f'"session": "{datetime.now().strftime("%Y-%m-%d")}", '
    sym = f'"symbol": "{getSymbol(r)}", '
    last = f'"px_last": {round(rand.uniform(100, 4900), 2)}, '
    volume = f'"px_volume": {rand.randint(1, 100)}, '
    vwap = f'"px_vwap": {round(rand.uniform(5000.0, 10000.0), 2)}, '
    p_o = round(rand.uniform(1, 5000.0), 2)
    px_open = f'"px_open": {p_o}, '
    p_h = round(rand.uniform(p_o, 5001.0), 2)
    px_high = f'"px_high": {p_h}, '
    p_l = round(rand.uniform(0, p_o), 2)
    px_low = f'"px_low": {p_l}, '
    p_s = round(rand.uniform(p_l, p_h), 2)
    px_set = f'"px_settle": {p_s}, '
    s_o = round(rand.uniform(p_o - 10, p_h + 10), 2)
    sesh_open = f'"session_open": {s_o}, '
    s_h = round(rand.uniform(p_h - 10, p_h + 10), 2)
    sesh_high = f'"session_high": {s_h}, '
    s_l = round(rand.uniform(p_l - 10, p_l + 10), 2)
    sesh_low = f'"session_low": {s_l}, '
    h_l = round(rand.uniform(p_h + 5, p_h + 20), 2)
    hi_lmt = f'"high_limit_price": {h_l}, '
    l_l = round(rand.uniform(p_l - 20, p_l - 5), 2)
    lo_lmt = f'"low_limit_price": {l_l}, '
    m_p = round(s_o - s_l, 2)
    max_p = f'"max_price_variation": {m_p}'

    time.sleep(NUM_SECONDS_SLEEP)

    print('{"type": "minute", '+date+root+sesh+sym+last+volume+vwap+px_open+px_high+px_low+px_set+sesh_open+sesh_high+sesh_low+hi_lmt+lo_lmt+max_p+'}')
