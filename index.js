var coders;
(function (coders) {
    var base64;
    (function (base64) {
        /**
        Copyright 2015, Christopher Brown <io@henrian.com>, MIT Licensed
        
        Encoding takes us from the raw source to a more obscure format.
        Decoding gets us from that format back to the raw source.
        
        In the case of base64, the raw (unencoded) source is an array of bytes, and the
        obscured (encoded) format is the base64 string.
        */
        base64.STANDARD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        function makeString(charCodes) {
            return String.fromCharCode.apply(null, charCodes);
        }
        base64.makeString = makeString;
        function unmakeString(str) {
            var length = str.length;
            var charCodes = new Array(length);
            for (var i = 0; i < length; i++) {
                charCodes[i] = str.charCodeAt(i);
            }
            return charCodes;
        }
        base64.unmakeString = unmakeString;
        /**
        Convert a Uint8Array or Array of numbers (in which case each element should be
        in the range 0-255) and returns an Array of numbers in the range 0-64.
        
        Mostly from https://gist.github.com/jonleighton/958841, benchmarks at
        http://jsperf.com/encoding-xhr-image-data/5
        */
        function encode(bytes) {
            var bytes_length = bytes.length;
            var byte_remainder = bytes_length % 3;
            var string_length = bytes_length - byte_remainder;
            var a, b, c, d;
            var chunk;
            var indices = [];
            // Main loop deals with bytes in chunks of 3
            for (var i = 0; i < string_length; i += 3) {
                // Combine the three bytes into a single integer
                chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                // Use bitmasks to extract 6-bit segments from the triplet
                a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
                b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
                c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
                d = chunk & 63; // 63       = 2^6 - 1
                // Convert the raw binary segments to the appropriate ASCII encoding
                indices.push(a, b, c, d);
            }
            // Deal with the remaining bytes and padding
            if (byte_remainder == 1) {
                chunk = bytes[string_length];
                a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
                // Set the 4 least significant bits to zero
                b = (chunk & 3) << 4; // 3   = 2^2 - 1
                indices.push(a, b, 64, 64);
            }
            else if (byte_remainder == 2) {
                chunk = (bytes[string_length] << 8) | bytes[string_length + 1];
                a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
                b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
                // Set the 2 least significant bits to zero
                c = (chunk & 15) << 2; // 15    = 2^4 - 1
                indices.push(a, b, c, 64);
            }
            // otherwise: no padding required
            return indices;
        }
        base64.encode = encode;
        /**
        Convert a Uint8Array or Array of numbers (in which case each element should be
        in the range 0-255) and returns a native Javascript string representation of
        the bytes in base64.
        
        Mostly from https://gist.github.com/jonleighton/958841, benchmarks at
        http://jsperf.com/encoding-xhr-image-data/5
        
        `alphabet` should contain 65 characters, where `alphabet[64]` is the padding
        character.
        */
        function encodeStringToString(raw_string, alphabet) {
            if (alphabet === void 0) { alphabet = base64.STANDARD_ALPHABET; }
            var bytes = unmakeString(raw_string);
            var indices = encode(bytes);
            return indices.map(function (i) { return alphabet[i]; }).join('');
        }
        base64.encodeStringToString = encodeStringToString;
        /**
        Decode an Array of numbers in the range 0-64 to an Array of numbers in the range
        0-255 (i.e., byte-sized).
        
        Based on https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js,
        which is Copyright 2011, Daniel Guerrero, BSD Licensed.
        */
        function decode(indices) {
            console.error('decode', indices);
            var length = indices.length;
            var bytes = [];
            for (var index = 0; index < length; index += 4) {
                // get the values of the next 4 base64 chars
                var c1 = indices[index];
                var c2 = indices[index + 1];
                var c3 = indices[index + 2];
                var c4 = indices[index + 3];
                // and derive the original bytes from them
                var b1 = (c1 << 2) | (c2 >> 4);
                var b2 = ((c2 & 15) << 4) | (c3 >> 2);
                var b3 = ((c3 & 3) << 6) | c4;
                // detect padding chars and adjust final length accordingly
                console.error('bytes', c1, c2, c3, c4, '->', makeString([b1, b2, b3]));
                if (c4 === 64) {
                    if (c3 === 64) {
                        // 2 padding bytes
                        bytes.push(b1);
                    }
                    else {
                        // 1 padding byte
                        bytes.push(b1, b2);
                    }
                }
                else {
                    // no padding
                    bytes.push(b1, b2, b3);
                }
            }
            return bytes;
        }
        base64.decode = decode;
        /**
        Decode a base64-encoded Javascript string into an array of numbers, all of will
        be in the range 0-255 (i.e., byte-sized).
        
        Based on https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js,
        which is Copyright 2011, Daniel Guerrero, BSD Licensed.
        */
        function decodeStringToString(base64_string, alphabet) {
            if (alphabet === void 0) { alphabet = base64.STANDARD_ALPHABET; }
            // TODO: optimize this with a for loop and an alphabet hashtable
            var indices = base64_string.split('').map(function (character) { return alphabet.indexOf(character); });
            var charCodes = decode(indices);
            return makeString(charCodes);
        }
        base64.decodeStringToString = decodeStringToString;
    })(base64 = coders.base64 || (coders.base64 = {}));
})(coders || (coders = {}));
module.exports = coders;
