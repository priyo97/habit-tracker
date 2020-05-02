function add_habit()
{
    var habit_name = document.getElementById("habit-name");
    var start_date = document.getElementById("habit-start-date");
    var start_time = document.getElementById("habit-start-time");

    HabitList.counter += 1;

    let h = {
        habit_id: HabitList.counter,
        habit_name: habit_name.value,
        habit_start_date: start_date.value,
        habit_start_time: start_time.value
    }

    HabitList.add_habit(h);

    habit_name.value = "";
    start_date.value = "";
    start_time.value = "";
}

document.getElementById("habit-button").addEventListener("click", add_habit);

function Habit(id, habit_name, habit_start_date, habit_start_time)
{
        this.habit_details = {
            habit_id: id,
            habit_name: habit_name,
            habit_start_date: habit_start_date,
            habit_start_time: habit_start_time
        };

        [this.year, this.month, this.day] = habit_start_date.split("-");
        [this.hours, this.mins] = habit_start_time.split(":");
            
        this.generate_start_time = function() {

            let year  = parseInt(this.year);
            let month = parseInt(this.month);
            let day   = parseInt(this.day);
            let hours = parseInt(this.hours);
            let mins  = parseInt(this.mins);

            return (new Date(year, month-1, day, hours, mins)).getTime().toString();
        };
        
        this.start_time = this.generate_start_time();

        this.update = function(habit_details) {
            this.habit_details = habit_details;
            
            [this.year, this.month, this.day] = habit_details.habit_start_date.split("-");
            [this.hours, this.mins] = habit_details.habit_start_time.split(":");

            this.start_time = this.generate_start_time();
        };

        this.start_timer = function() {

            let start_time = parseInt(this.start_time);

            this.timer_obj = setInterval(function(id, start_time) {
                current_time = Date.now();
                time_elapsed = current_time - start_time;

                var days  = Math.floor(time_elapsed / (24 * 60 * 60 * 1000));
                var rem   = time_elapsed % (24 * 60 * 60 * 1000); 
                var hours = Math.floor(rem / (60 * 60 * 1000));
                var rem   = rem % (60 * 60 * 1000); 
                var mins  = Math.floor(rem / (60 * 1000));
                var rem   = rem % (60 * 1000); 
                var secs  = Math.floor(rem / 1000);

                document.getElementById("set-habit-time-since-last-" + id).textContent = days + "\xa0\xa0\xa0days\xa0\xa0\xa0\xa0:\xa0\xa0\xa0\xa0" + hours + "\xa0\xa0\xa0hours\xa0\xa0\xa0\xa0:\xa0\xa0\xa0\xa0" + mins + "\xa0\xa0\xa0mins\xa0\xa0\xa0\xa0:\xa0\xa0\xa0\xa0" + secs + "\xa0\xa0\xa0secs";

            }, 1000, this.habit_details.habit_id, start_time);    
        };

        this.stop_timer = function() {
            clearInterval(this.timer_obj);
        };

}

class HabitList
{
    static load_habits_from_storage()
    {
        let habit_list_from_storage = JSON.parse(localStorage.getItem("habit-list"));
        
        if(habit_list_from_storage == null)
        {
            HabitList.counter    = 0;
            HabitList.habit_list = [];
            HabitList.habit_details_list = [];
        }
        else
        {
            let h;

            for(let i = 0 ; i < habit_list_from_storage.length ; i++)
            {
                h = habit_list_from_storage[i];

                if(h.habit_id > HabitList.counter)
                    HabitList.counter = h.habit_id;

                HabitList.add_habit(h);
            }
        }
    }
    
    static update_storage()
    {
        localStorage.setItem("habit-list", JSON.stringify(HabitList.habit_details_list));
    }
    
    static add_habit(h)
    {
        let h_obj = new Habit(h.habit_id, h.habit_name, h.habit_start_date, h.habit_start_time);
        
        HabitList.render_habit(h_obj);
        HabitList.habit_list.push(h_obj);
        HabitList.habit_details_list.push(h);
        HabitList.update_storage();
        
    }

    static del_habit(habit_id)
    {
        let h;

        for(let i=0; i < HabitList.habit_list.length ; i++)
        {
            if(HabitList.habit_details_list[i].habit_id == habit_id)
            {
                h = HabitList.habit_list[i];
                HabitList.unrender_habit(h);
                HabitList.habit_list.splice(i, 1);
                HabitList.habit_details_list.splice(i, 1);
                HabitList.update_storage();
                break; 
            }
        }
    }

    static update_habit(habit_id)
    {
        let i, h;
        for(i=0; i < HabitList.habit_list.length ; i++)
        {
            if(HabitList.habit_details_list[i].habit_id == habit_id)
            {
                h = HabitList.habit_list[i];
                break; 
            }
        }

        document.querySelector("#habit-update-box #habit-name").value = h.habit_details.habit_name;
        document.querySelector("#habit-update-box #habit-start-date").value = h.habit_details.habit_start_date;
        document.querySelector("#habit-update-box #habit-start-time").value = h.habit_details.habit_start_time;
        document.querySelector("#habit-update-box #habit-button").addEventListener("click", function(){
            
            let h_details = {
                habit_id: habit_id,
                habit_name: document.querySelector("#habit-update-box #habit-name").value,
                habit_start_date: document.querySelector("#habit-update-box #habit-start-date").value,
                habit_start_time: document.querySelector("#habit-update-box #habit-start-time").value
            };

            HabitList.habit_details_list[i] = h_details;
            h.stop_timer();
            h.update(h_details);
            h.start_timer();
            HabitList.render_updated_habit(h_details);
            HabitList.update_storage();
         
            document.querySelector("#habit-update-box").style.display = "none";
            document.querySelector("#update-modal").style.display = "none";
        });
         
        document.querySelector("#habit-update-box").style.display = "block";
        document.querySelector("#update-modal").style.display = "block";
    }

    static render_updated_habit(h_details)
    {
        let habit_id = h_details.habit_id;
        document.querySelector("#set-habit-name-" + habit_id).textContent       = h_details.habit_name;
        document.querySelector("#set-habit-start-date-" + habit_id).textContent = h_details.habit_start_date;
        document.querySelector("#set-habit-start-time-" + habit_id).textContent = h_details.habit_start_time;
    }

    static unrender_habit(h)
    {
        h.stop_timer();
        let habit_element = document.getElementById("habit_" + h.habit_details.habit_id);
        habit_element.remove();
    }

    static render_habit(h_obj)
    {
        let h = h_obj.habit_details;
 
        let habit_list_element = document.getElementById("habit-list");

        let habit_element = document.createElement("div");
        habit_element.className = "habit-details";
        habit_element.id = "habit_" + h.habit_id;
        
        let p_habit_name            = document.createElement("p");
        let p_habit_start_date      = document.createElement("p");
        let p_habit_start_time      = document.createElement("p");
        let p_habit_time_since_last = document.createElement("p");
        let p_on = document.createElement("p");

        p_on.className = "pOn";
        p_on.textContent = "on";

        p_habit_name.className = "pHabitName";
        p_habit_name.id = "set-habit-name-" + h.habit_id;
        p_habit_name.textContent = h.habit_name;

        p_habit_start_date.className = "pHabitDate";
        p_habit_start_date.id = "set-habit-start-date-" + h.habit_id;
        p_habit_start_date.textContent = h.habit_start_date;

        p_habit_start_time.className = "pHabitTime";
        p_habit_start_time.id = "set-habit-start-time-" + h.habit_id;
        p_habit_start_time.textContent = h.habit_start_time;

        p_habit_time_since_last.className = "pHabitTimeLast";
        p_habit_time_since_last.id = "set-habit-time-since-last-" + h.habit_id;

        habit_element.appendChild(p_habit_name);
        habit_element.appendChild(p_habit_start_time);
        habit_element.appendChild(p_on);
        habit_element.appendChild(p_habit_start_date);
        habit_element.appendChild(p_habit_time_since_last);


        let id = h.habit_id;

        let habit_del_button = document.createElement("button");
        habit_del_button.textContent = "Delete";
        habit_del_button.className = "drop-habit-button";
        habit_del_button.id = "drop-habit-button";
        
        let habit_update_button = document.createElement("button");
        habit_update_button.textContent = "Update";
        habit_update_button.className = "update-habit-button";
        habit_update_button.id = "update-habit-button";

        habit_del_button.addEventListener("click", function(){
            HabitList.del_habit(id);
        });
        
        habit_update_button.addEventListener("click", function(){
            HabitList.update_habit(id);
        });

        habit_element.appendChild(habit_update_button);
        habit_element.appendChild(habit_del_button);
        

        habit_list_element.appendChild(habit_element);

        h_obj.start_timer();
    }    
}

HabitList.habit_list = [];
HabitList.habit_details_list = [];
HabitList.counter = 0;

HabitList.load_habits_from_storage()