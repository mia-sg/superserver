const helper = require('./viewenginehelpers.js');
const { getAll : allLocals } = require('./locals.js');



function view(p_res, p_options )
{   
    p_options.title = p_options.title ?? p_options.view;
    p_options.app_name = p_options.app_name ?? p_res.app.settings.app_name;
    let data = {
        ...p_options,
        ...allLocals(),
        helper
    }
    
    p_res.render(`dist/apps/${p_options.app_name}/index` , data );
}

module.exports =  {
    view
}