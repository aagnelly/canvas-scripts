// ==UserScript==
// @name         DELETE ENROLLMENT BUTTON
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds functionality to remove all student enrollments from a section. Observers fall off by default; teachers still manual.Caps at 200 enrollments.
// @author       You
// @match https://hcpss-tc.instructure.com/courses/*/sections/*
// @grant        none
// ==/UserScript==

    var feature = document.URL.split('/')[5];

    if (feature === 'sections') {
        var section_id = document.URL.split('/')[6];
        var course_id = document.URL.split('/')[4];
        console.log('section ' + section_id + ' course: ' + course_id);
        //Add button
        var button = document.createElement("button");
        button.innerHTML = "!! Remove ALL Student enrollments !!";
        var buttonPanel = document.getElementById("right-side-wrapper");
        buttonPanel.appendChild(button);
        button.addEventListener ("click", function() {
            getEnrollments();
        });
    }



function getEnrollments(){
    var url = 'https://hcpss-tc.instructure.com/api/v1/sections/'+ section_id + '/enrollments?type=StudentEnrollment&per_page=200';
    $.getJSON(url, function(data, status, jqXHR){
        var enrollmentId;
        var allSectionEnrollments = [];
            data.forEach(enrollment => {
                enrollmentId = enrollment.id;
                allSectionEnrollments.push(enrollmentId);
            });
        var student;
        var i;
        for(i=0; i<allSectionEnrollments.length; i++){
            student = allSectionEnrollments[i];
            var url2 = 'https://hcpss-tc.instructure.com/api/v1/courses/'+ course_id + '/enrollments/' + student + '?task=delete';
            deleteEnrollment(url2, student);
        }

    });
}


function deleteEnrollment(url2, student) {
$.ajax({
    type: "DELETE",
    url: url2,
    data: "name=someValue",
    success: function(){
                alert("Students removed. Refresh your browser");
    }
});

}
