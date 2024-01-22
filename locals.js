let all_locals = {  };

function register( p_name, p_obj )
{
    all_locals[ p_name ] = p_obj;
}

function getAll()
{
    return all_locals;
}


module.exports = {
    register, getAll
}