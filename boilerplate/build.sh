# document structure
mkdir bower
mkdir css
mkdir database
mkdir extra
mkdir fig
mkdir files
mkdir js
mkdir js/directives
mkdir js/filters
mkdir js/services
mkdir js/temp
mkdir js/utils
mkdir php
mkdir rest
mkdir rest/repositories
mkdir rest/rest
mkdir rest/services
mkdir scss
mkdir structure
mkdir templates
mkdir fig
mkdir uploads
mkdir local
chmod 777 uploads
chmod 777 uploads/local

# javascript and boilerplate code
git clone https://github.com/mathCodingClub/js-mcc.git
# js
cp js-mcc/boilerplate/js/* js/
# scss
cp js-mcc/boilerplate/scss/* scss/
# structure
cp js-mcc/boilerplate/structure/* structure/*
cp js-mcc/boilerplate/htaccess/root .htaccess
cp js-mcc/boilerplate/htaccess/rest rest/.htaccess
# rest
cp js-mcc/boilerplate/structure/* structure/*
cp js-mcc/boilerplate/rest/* rest/*
# templates
cp js-mcc/boilerplate/templates/* templates/*
# main
cp js-mcc/boilerplate/main/index.php index.php
# composer
cp js-mcc/boilerplate/composer.json php/composer.json
# javascript minimization
cd js
php minimize.php
cd ..
cd js-mcc
php minimize.php
cd ..
# bower
cp js-mcc/boilerplate/.bowerrc .
cp js-mcc/boilerplate/bower.json .
bower install

# init php backend
git clone https://github.com/mathCodingClub/mcc-php-backend php/mcc
chmod 777 php/mcc/obj/cache/files
# composer
cd php
composer install
cd ..

echo "Up and running"

