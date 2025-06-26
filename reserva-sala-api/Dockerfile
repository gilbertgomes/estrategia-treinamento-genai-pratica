FROM php:8.3.10-fpm-alpine3.19

LABEL authors="gilberto"

ENV TZ="America/Manaus"

RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    postgresql-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

RUN docker-php-ext-install opcache

RUN docker-php-ext-install pdo pdo_pgsql

# Set the timezone in /etc/localtime
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN apk add --no-cache shadow \
    && usermod -u 1004 www-data \
    && apk del shadow
# Create the application directory

RUN chown -R www-data:www-data /var/www/html

WORKDIR /var/www/html

COPY /.docker/php/php.ini /usr/local/etc/php/conf.d/docker-app.ini

EXPOSE 9000

CMD ["php-fpm"]
