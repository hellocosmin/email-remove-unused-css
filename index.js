'use strict'

// ===================================
// R E Q U I R E' S

var fs = require('fs')
var parser = require('posthtml-parser')

// ===================================
// F U N C T I O N S

/**
 * isObject - detects is it a true object or not
 *
 * @param  {Unknown?} item something is passed
 * @return {Boolean}      true, if it's real object passed. False otherwise
 */
function isObject (item) {
  return (typeof item === 'object' && !Array.isArray(item) && item !== null)
}

// =========

/**
 * getTag - This is a walker-function for fealing with PostHTML-parsed AST.
 * Pass array or object and a tag name.
 * It will recursively walk the incoming "objOrArr" until it will find an
 * object with a key "tag" and a value "tagName" (incoming var).
 * Then it will look for a key "content" at the same depth as found key "tag".
 * If it exists, it will return "content". Same with "attrs", if found at the
 * same level, it's contents will be returned.
 *
 * @param  {Object|Array} objOrArr pass in the PostHTML AST (normally an array).
 * @param  {String} tagName  name of the tag (which is a key value in an object)
 * @return {Object|null}          two keys: 'attrs' and 'content', each if found
 */
function getTag (objOrArr, tagName, findingsArray) {
  var tempObj = {}
  findingsArray = findingsArray || []
  if (tagName === null || tagName === undefined || tagName === '' || typeof tagName !== 'string') {
    return null
  }
  // if object is passed, crawl it, checking for key=tagName:
  if (isObject(objOrArr)) {
    // it's an object. Iterate through it.
    Object.keys(objOrArr).forEach(function (el) {
      // console.log('objOrArr[' + el + ']=' + JSON.stringify(objOrArr[el], null, 4))
      if (objOrArr[el] === tagName) {
        // console.log('FOUND ' + tagName + '!')
        tempObj = {}
        tempObj['tag'] = tagName
        if (objOrArr['attrs']) {
          tempObj['attrs'] = objOrArr['attrs']
        }
        if (objOrArr['content']) {
          tempObj['content'] = objOrArr['content']
        }
        // console.log('tempObj = ' + JSON.stringify(tempObj, null, 4))
        // console.log('objOrArr[attrs] = ' + JSON.stringify(objOrArr['attrs'], null, 4))
        // console.log('objOrArr[content] = ' + JSON.stringify(objOrArr['content'], null, 4))
        findingsArray.push(tempObj)
      }
      if (Array.isArray(objOrArr[el])) {
        getTag(objOrArr[el], tagName, findingsArray)
      }
    })
  } else if (Array.isArray(objOrArr)) {
    // else, it's an array. Iterate each key, if it's an obj, call getTag()
    objOrArr.forEach(function (el, i) {
      // console.log('array el[' + i + ']=' + JSON.stringify(el, null, 4))
      if (isObject(el)) {
        getTag(el, tagName, findingsArray)
      }
    })
  }
  return findingsArray
}

// =========

/**
 * emailRemoveUnusedCss - the main function
 * Purpose: for use in email newsletter development to clean email templates
 * Removes unused CSS from HEAD and unused CSS from BODY
 *
 * @param  {String} htmlContentsAsString incoming HTML as (UTF-8) string
 * @return {String}                      cleaned HTML as (UTF-8) string
 */
function emailRemoveUnusedCss (htmlContentsAsString) {
  var cleanedContents
  return cleanedContents
}

// ===================================
// A C T I O N

(function () {
  var step_one = fs.readFileSync('./dummy_html/test1.html').toString()
  var step_two = parser(step_one)
  var step_three = getTag(step_two, 'style')
  console.log('step_three = ' + JSON.stringify(step_three, null, 4))
})()