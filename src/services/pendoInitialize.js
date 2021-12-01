const API_KEY = "d01724ca-c849-4d41-5165-56ce00a127fd";
export default function pendoInitialize(user) {
    (function (p, e, n, d, o) {
        var v, w, x, y, z;
        o = p[d] = p[d] || {};
        o._q = [];
        v = ["initialize", "identify", "updateOptions", "pageLoad"];
        for (w = 0, x = v.length; w < x; ++w)
            (function (m) {
                o[m] =
                    o[m] ||
                    function () {
                        o._q[m === v[0] ? "unshift" : "push"](
                            [m].concat([].slice.call(arguments, 0))
                        );
                    };
            })(v[w]);
        // Create a `<script>` tag linked to your application-specific Agent build from our CDN...
        y = e.createElement(n);
        y.async = !0;
        y.src = `https://cdn.pendo.io/agent/static/${API_KEY}/pendo.js`;
        z = e.getElementsByTagName(n)[0];
        z.parentNode.insertBefore(y, z);
    })(window, document, "script", "pendo");

    // Please use Strings, Numbers, or Bools for value types.
    pendo.initialize({
        visitor: {
            id: user.id,
            name: user.firstName,
            surname: user.lastName,
            email: user.email,
        },

        account: {
            id: user.id,
            organizationName: user.companyName,
            organizationId: user.organizationId 
            // name:         // Optional
            // planLevel:    // Optional
            // planPrice:    // Optional
            // creationDate: // Optional

            // You can add any additional account level key-values here,
            // as long as it's not one of the above reserved names.
        },
    });
}