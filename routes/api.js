'use strict';
const express = require('express');
const app = express()
const mongoose = require('mongoose');
require('dotenv').config();

require('../db.js');

const Stock = require('../model/model.js')
const PORT = process.env.PORT || 5000;

// Import data from 
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getData(stock) {
    const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
    const result = await response.json();
    return result;
}

// create stock
async function createStock(stock, ip, like) {

    const objStock = await Stock.create({
        "stock": stock,
        "ips": like ? [ip] : [],
    });

    return objStock;
}

// find stock in databse
async function findStock(stock, ip, like) {

    const myStock = await Stock.findOne({ "stock": stock }).exec();

    if (stock) {
        return myStock;
    } else {
        const newStock = createStock(stock, ip, like);
        return newStock;
    }
}

// Check like 
async function checkLIke(stock, ip, like) {
    let likes = 0;
    let ips = stock.ips;
    if (like && !ips.includes(ip)) {
        ips.push(myIP);
        await stock_found.save();
    }
    likes = ips.length;
    // console.log(stock)
    return likes;
}

module.exports = (app) => {

    app.route('/api/stock-prices').get(async (req, res) => {
        const { stock, like } = req.query;
        const myIP = req.ip;
        let stockArray = [];
        let nbLike = 0;

        // console.log(stock);

        // if stock is an array
        if (Array.isArray(stock)) {


            const stock1 = await getData(stock[0]);
            const latestPrice1 = stock1.latestPrice;
            const symbol1 = stock1.symbol;

            const stock2 = await getData(stock[1]);
            const latestPrice2 = stock2.latestPrice;
            const symbol2 = stock2.symbol;

            // Check if the first symbol is in Database
            const stock_found1 = await findStock(symbol1, myIP, like);

            if (!stock_found1) {
                const newStock1 = await createStock(symbol1, myIP, like);
                newStock1.save();
            } else {

                nbLike = await checkLIke(stock_found1, myIP, like);
            }

            // Check if the second symbol is in Database
            const stock_found2 = await findStock(symbol2, myIP, like);

            if (!stock_found2) {
                const newStock2 = await createStock(symbol2, myIP, like);
                newStock2.save();
            } else {

                nbLike = await checkLIke(stock_found2, myIP, like);
            }


            stockArray.push({
                "stock": stock_found1.symbol, "price": latestPrice1, "rel_likes": nbLike,
            },
                {
                    "stock": stock_found2.symbol, "price": latestPrice2, "rel_likes": nbLike,
                });

            // console.log(stockArray);

            return res.json({
                "stockData": stockArray,
            });

        }


        const { latestPrice, symbol } = await getData(stock);
        // console.log(latestPrice + " " + symbol)

        // Check if symbol is in Database
        const stock_found = await findStock(symbol, myIP, like);

        if (!stock_found) {
            const newStock = await createStock(symbol, myIP, like);
            newStock.save();
            return res.json({
                "stockData": {
                    "stock": symbol,
                    "price": latestPrice,
                    "likes": like == "false" ? 0 : 1,
                }
            });
        } else {

            nbLike = await checkLIke(stock_found, myIP, like);

            return res.json({
                "stockData": {
                    "stock": stock_found.stock,
                    "price": latestPrice,
                    "likes": nbLike,
                }
            });
        }

    });

};








