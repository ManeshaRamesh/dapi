var React = require('react');
var ReactDOM = require('react-dom');

var userEntry = React.createClass({
    render: function(){
        return <form>

                    Username: <input id = "username"  type="text" name="username" value="12345678"><br>
                    Password: <input id = "password" type="text" name="password" type="password" value="kkkkk"><br>
                    <input type="submit" value="Submit">
        </form>
    }
})