/**
 *
 * @license MIT License Copyright (c) 2017 Abhijit Gurav
 * @author  Abhijit Gurav, https://github.com/abhijit-g/
 *
 */

/**
 *  @ngdoc object
 *  @name service.snakeService
 *
 *  @requires gameService
 *  @requires gameConstants
 *  @requires boardService
 *  @requires $timeout
 *
 *  @description
 *  This service is heart of game, which deals with drawing snake updating position detecting collisions.
 *  Serving eggs, score update, life management, calling level up in short everything :P
 */
angular.module("snake")
    .factory("snakeService", ["gameService", "gameConstants", "boardService", "$timeout", function(gameService, gameConstants, boardService, $timeout) {
        "use strict";


        /**
         * @ngdoc property
         * @name service.snakeService#head
         * @propertyOf service.snakeService
         *
         * @description
         * property to store snakehead object
         */
        var head = new Image();

        /**
         * @ngdoc property
         * @name service.snakeService#snakeBody
         * @propertyOf service.snakeService
         *
         * @description
         * property to store snakeBody object
         */
        var snakeBody = new Image();
        snakeBody.src = 'App/images/body.png';

        /**
         * @ngdoc property
         * @name service.snakeService#eggImg
         * @propertyOf service.snakeService
         *
         * @description
         * property to store eggImg object
         */
        var eggImg = new Image();
        eggImg.src = 'App/images/egg.png';

        /**
         * @ngdoc property
         * @name service.snakeService#snake
         * @propertyOf service.snakeService
         *
         * @description
         * property to store whole snake in array :P
         */
        var snake = null;

        /**
         * @ngdoc property
         * @name service.snakeService#score
         * @propertyOf service.snakeService
         *
         * @description
         * property to store score
         */
        var score = 0;

        /**
         * @ngdoc property
         * @name service.snakeService#egg
         * @propertyOf service.snakeService
         *
         * @description
         * property to store egg object
         */
        var egg = null;

        /**
         * @ngdoc property
         * @name service.snakeService#status
         * @propertyOf service.snakeService
         *
         * @description
         * property to used for keypress status
         */
        var status = null;

        /**
         * @ngdoc property
         * @name service.snakeService#collision
         * @propertyOf service.snakeService
         *
         * @description
         * property to store collision status
         */
        var collision = false;

        /**
         * @ngdoc property
         * @name service.snakeService#direction
         * @propertyOf service.snakeService
         *
         * @description
         * property to store all directions taken by head
         */
        var direction = null;

        /**
         * @ngdoc property
         * @name service.snakeService#wall
         * @propertyOf service.snakeService
         *
         * @description
         * property to store wall to check collision
         */
        var wall = null;

        /**
         * @ngdoc property
         * @name service.snakeService#lives
         * @propertyOf service.snakeService
         *
         * @description
         * property to store lives
         */
        var lives = [1, 2, 3];

        /**
         * @ngdoc property
         * @name service.snakeService#eggPending
         * @propertyOf service.snakeService
         *
         * @description
         * property to store pending egg to be eaten by snake in respective level
         */
        var eggPending = gameConstants.eggPerLevel;
		
		var die = new Howl({ src: ['App/sounds/die.wav'] });

        var eat = new Howl({ src: ['App/sounds/eat.wav'] });

        /**
         * @ngdoc method
         * @name service.snakeService#create
         * @methodOf service.snakeService
         *
         * @description
         * Method will create necessary initial data req.
         */
        function create() {
            // init snake with head and 3 body part
            snake =[
                {x : 100, y : 40, dir: 'right'},
                {x : 80, y : 40, dir: 'right'},
                {x : 60, y : 40, dir: 'right'},
                {x : 40, y : 40, dir: 'right'}
            ];

            //initial direction which is given as right
            direction = [{x: 100, y: 40, dir: 'right', process: 0}];

            status = 'waiting';

            //init pending egg with defined constants
            eggPending = gameConstants.eggPerLevel;
        }

        /**
         * @ngdoc method
         * @name service.snakeService#getRandomInt
         * @methodOf service.snakeService
         *
         * @description
         * Method will generate random number between passed limit
         */
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        /**
         * @ngdoc method
         * @name service.snakeService#isValidMove
         * @methodOf service.snakeService
         *
         * @description
         * Method is used to check is keypress direction is valid eg. if up user not allowed to go down and so on ;)
         */
        function isValidMove(headDir) {
            if(headDir === 'up' && status === 'down'){
                return false;
            } else if(headDir === 'down' && status === 'up'){
                return false;
            } else if(headDir === 'left' && status === 'right'){
                return false;
            } else if(headDir === 'right' && status === 'left'){
                return false;
            } else {
                return true;
            }
        }

        /**
         * @ngdoc method
         * @name service.snakeService#isCollide
         * @methodOf service.snakeService
         *
         * @description
         * Generic logic for image collision (only look complex :P )
         */
        function isCollide(objAX, objAY, objASize, objBX, objBY, objBSize) {
            return (objAX >= 0 && objAY >= 0 && objBX >= 0 && objBY >= 0 )
                && !(((objAY + objASize) < (objBY)) || (objAY > (objBY + objBSize))
                    || ((objAX + objASize) < objBX) || (objAX > (objBX + objBSize)));
        }

        /**
         * @ngdoc method
         * @name service.snakeService#checkCollision
         * @methodOf service.snakeService
         *
         * @description
         * Method will be called each time to check is snake is collide with itself or wall
         */
        function checkCollision(x, y){
            //checks is snake collide with itself
            var flag = _.some(snake, function(body, index) {
                return index > 4 &&
                    isCollide(x, y, gameConstants.snakeSize, body.x, body.y, gameConstants.snakeSize);
            });
            //checks is snake collide with wall (wall is consist of border bricks as well as inner maze)
            if(!flag){
                flag = _.some(wall, function(brick) {
                    return isCollide(x, y, gameConstants.snakeSize, brick.x, brick.y, gameConstants.brickSize);
                });
            } else {
                return true;
            }

            return flag;
        }

        return {

            /**
             * @ngdoc method
             * @name service.snakeService#checkCreateSnake
             * @methodOf service.snakeService
             *
             * @description
             * Method will be called to init if not
             */
            checkCreateSnake: function() {
                if (snake) {
                    return;
                }

                create();
            },

            /**
             * @ngdoc method
             * @name service.snakeService#destroy
             * @methodOf service.snakeService
             *
             * @description
             * Method will be called to destroy when want to reset
             */
            destroy: function() {
                snake = null;
                direction = null;
                status = null;
                egg = null;
            },

            /**
             * @ngdoc method
             * @name service.snakeService#reset
             * @methodOf service.snakeService
             *
             * @description
             * Method will be called to reset
             */
            reset: function() {
                lives = _.slice(lives, 0, -1);
                if(lives.length < 1){
                    lives = [1, 2, 3];
                    score = 0;
                }
                collision = false;
            },

            /**
             * @ngdoc method
             * @name service.snakeService#resetLives
             * @methodOf service.snakeService
             *
             * @description
             * Method will reset lives
             */
            resetLives: function(){
                lives = [];
            },

            /**
             * @ngdoc method
             * @name service.snakeService#getEgg
             * @methodOf service.snakeService
             *
             * @description
             * Method will return pending egg
             */
            getEgg: function(){
                return eggPending;
            },

            /**
             * @ngdoc method
             * @name service.snakeService#getScore
             * @methodOf service.snakeService
             *
             * @description
             * Method will return score
             */
            getScore: function() {
                return score;
            },

            /**
             * @ngdoc method
             * @name service.snakeService#getLives
             * @methodOf service.snakeService
             *
             * @description
             * Method will return lives
             */
            getLives: function(){
                return lives;
            },

            /**
             * @ngdoc method
             * @name service.snakeService#isCollided
             * @methodOf service.snakeService
             *
             * @description
             * Method will return collision flag status
             */
            isCollided: function() {
                return collision;
            },

            /**
             * @ngdoc method
             * @name service.snakeService#keyPress
             * @methodOf service.snakeService
             *
             * @description
             * Method will take care of user keypress event
             */
            keyPress: function(keyCode) {
                if(keyCode === 38){
                    status = 'up'
                } else if(keyCode === 37){
                    status = 'left'
                } else if(keyCode === 39){
                    status = 'right'
                }else if(keyCode === 40){
                    status = 'down'
                }
            },

            /**
             * @ngdoc method
             * @name service.snakeService#update
             * @methodOf service.snakeService
             *
             * @description
             * Method will called to update the position of snake based on new direction or old one
             */
            update: function(animation){
                if (!snake) {
                    return;
                }

                if (animation % 2 !== 0) {
                    return;
                }

                // get new updated position for snake
                _.forEach(snake, function(body, index) {
                    //if new direction is available and head is getting processed ten push this in direction array for others to follow
                    if(index === 0 && status !== 'waiting' && isValidMove(body.dir)){
                        direction.push({x: body.x, y: body.y, dir: status, process: 0});
                        status = 'waiting';
                    }

                    body.prevX = body.x;
                    body.prevY = body.y;

                    //get new direction for snake body parts if not processed for it
                    var newDirection = _.find(direction, function(dir) {
                        return dir.x === body.prevX && dir.y === body.prevY && dir.process === index;
                    });

                    //if new direction available get it and marked it processed for this index
                    if(!angular.isUndefined(newDirection)){
                        body.dir = newDirection.dir;
                        newDirection.process++;
                    }

                    //update of position based on direction
                    if(body.dir === 'right'){
                        body.dx = gameConstants.speed;
                        body.dy = 0;
                        body.x += gameConstants.speed;
                    } else if(body.dir === 'left'){
                        body.dx = -gameConstants.speed;
                        body.dy = 0;
                        body.x -= gameConstants.speed;
                    } else if(body.dir === 'up'){
                        body.dx = 0;
                        body.dy = -gameConstants.speed;
                        body.y -= gameConstants.speed;
                    } else if(body.dir === 'down'){
                        body.dx = 0;
                        body.dy = gameConstants.speed;
                        body.y += gameConstants.speed;
                    }
                });
            },

            /**
             * @ngdoc method
             * @name service.snakeService#draw
             * @methodOf service.snakeService
             *
             * @description
             * Method will called to draw snake, egg based on updated position and also check that is new position is colliding with anything
             */
            draw: function() {
                var that = this;
                if (!snake) {
                    return;
                }

                wall = boardService.getWall();

                var destX;
                var destY;

                //if egg not present put one
                if(!egg){
                    egg = {x: getRandomInt(50, 550), y: getRandomInt(50, 550)};
                    // if egg is in the wall get new co-ordinates outside wall
                    if(wall){
                        _.forEach(wall, function(brick) {
                            while(isCollide(brick.x, brick.y, gameConstants.brickSize, egg.x, egg.y, gameConstants.eggSize)){
                                egg = {x: getRandomInt(50, 550), y: getRandomInt(50, 550)};
                            }
                        });
                    }
                } else {
                    //put egg on canvas
                    gameService.drawImage(eggImg, egg.x, egg.y);
                }

                //draw snake
                _.forEach(snake, function(body, index) {
                    destX = body.prevX + (body.dx);
                    destY = body.prevY + (body.dy);
                    //draw head
                    if(index === 0){
                        // default :) head image
                        head.src = 'App/images/head_1_' + body.dir + '.png';
                        // if collide get :( image of head based on direction
                        if(checkCollision(destX, destY)){
							die.play();
                            if(lives.length - 1 < 1){
                                gameService.drawText('GAME OVER !!!',220, 100, 'red');
                                gameService.drawText('Hit Space bar to ReStart.', 150, 150, '#99ecf7');
                            } else {
                                gameService.drawText('Hit Space bar to use life.', 150, 100, '#99ecf7');
                            }

                            head.src = 'App/images/head_2_' + body.dir + '.png';
                            //delay just to draw few things and then pause
                            $timeout(function () {
                                collision = true;
                            }, 30);
                        }

                        gameService.drawImageWH(head, destX, destY, gameConstants.snakeSize, gameConstants.snakeSize);
                    }else{
                        //draw body
                        gameService.drawImageWH(snakeBody, destX, destY, gameConstants.snakeSize, gameConstants.snakeSize);
                    }

                    //check egg eating
                    if(index === 0 &&
                        isCollide(destX, destY, gameConstants.snakeSize, egg.x, egg.y, gameConstants.eggSize)){
						eat.play();
                        //update score
                        score += 100;
                        //decrease egg pending count
                        eggPending--;
                        //when no more egg pending increase level
                        if(eggPending === 0){
                            $timeout(function () {
                                eggPending = gameConstants.eggPerLevel;
                                //when user complete final level
                                if(gameConstants.finalLevel === boardService.getLevel()){
                                    gameService.drawText('Congratulations !!!',180, 180, '#ffeb3b');
                                    gameService.drawText('Now you will be called as', 140, 240, '#99ecf7');
                                    gameService.drawText('Snake Master', 220, 300, 'red');
                                }
                                //just level up
                                else {
                                    gameService.drawText('LEVEL UP !!!',220, 100, '#ffeb3b');
                                    gameService.drawText('Hit Space bar to cont...', 160, 150, '#99ecf7');
                                }
                                boardService.raiseLevel();
                                that.destroy();
                            }, 30);
                        }

                        // increase snake length with adding two bodies at end based on direction
                        var newBody = angular.copy(_.last(snake));
                        var newBody2 = angular.copy(_.last(snake));
                        if(newBody.dir === 'right'){
                            newBody.x -= gameConstants.snakeSize;
                            newBody2.x -= 2 * gameConstants.snakeSize;
                        } else if(newBody.dir === 'left'){
                            newBody.x += gameConstants.snakeSize;
                            newBody2.x += 2 * gameConstants.snakeSize;
                        }else if(newBody.dir === 'up'){
                            newBody.y += gameConstants.snakeSize;
                            newBody2.y += 2 * gameConstants.snakeSize;
                        }else if(newBody.dir === 'down'){
                            newBody.y -= gameConstants.snakeSize;
                            newBody2.y -= 2 * gameConstants.snakeSize;
                        }
                        snake.push(newBody);
                        snake.push(newBody2);
                        //ready for new egg
                        egg = null;
                    }
                });

                //when particular direction is processed for whole snake then removed from array
                _.remove(direction, function(dir) {
                    return dir.process === snake.length;
                });
            }
        }
    }]);