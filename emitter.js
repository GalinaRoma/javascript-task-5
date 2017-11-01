'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;


/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const events = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            events.push({ event, context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            const eventsToDelete = events.filter((currentEventObj) => {
                return ((currentEventObj.event.indexOf(event + '.') !== -1 ||
                    currentEventObj.event === event) &&
                    currentEventObj.context === context);
            });
            eventsToDelete.forEach((elem) => {
                const currentIndex = events.indexOf(elem);
                events.splice(currentIndex, 1);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const eventsToEmit = event.split('.');
            while (eventsToEmit.length !== 0) {
                const elem = eventsToEmit.join('.');
                events.forEach((currentEventObj) => {
                    if (currentEventObj.event === elem) {
                        currentEventObj.handler.call(currentEventObj.context);
                    }
                });
                eventsToEmit.pop();
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                return this.on(event, context, handler);
            }

            this.on(event, context, function () {
                if (times <= 0) {
                    return;
                }
                handler.call(context);
                times--;
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }
            let counter = 0;

            this.on(event, context, function () {
                if (counter % frequency === 0) {
                    handler.call(context);
                }
                counter++;
            });

            return this;
        }
    };
}
