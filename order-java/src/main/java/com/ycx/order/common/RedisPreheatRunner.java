package com.ycx.order.common;

import com.ycx.order.common.stockWithRedis.RedisKeysConstant;
import com.ycx.order.common.utils.RedisPoolUtil;
import com.ycx.order.pojo.Stock;
import com.ycx.order.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 缓存预热，在 Spring Boot 启动后立即执行此方法
 */
@Component
public class RedisPreheatRunner implements ApplicationRunner  {

    @Autowired
    private StockService stockService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 从数据库中查询热卖商品
        Stock stock = stockService.getStockById(1);

        // 删除旧缓存
        RedisPoolUtil.del(RedisKeysConstant.STOCK_COUNT + stock.getCount());
        RedisPoolUtil.del(RedisKeysConstant.STOCK_SALE + stock.getSale());
        RedisPoolUtil.del(RedisKeysConstant.STOCK_VERSION + stock.getVersion());
        //缓存预热
        int sid = stock.getId();
        RedisPoolUtil.set(RedisKeysConstant.STOCK_COUNT + sid, String.valueOf(stock.getCount()));
        RedisPoolUtil.set(RedisKeysConstant.STOCK_SALE + sid, String.valueOf(stock.getSale()));
        RedisPoolUtil.set(RedisKeysConstant.STOCK_VERSION + sid, String.valueOf(stock.getVersion()));
    }
}
