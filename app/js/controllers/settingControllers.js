/**
 * Created by justsavor on 15/4/29.
 */

var settingModule = angular.module('settingModule',[])

settingModule.controller('SettingCtrl',['$scope','$http', function ($scope,$http) {

    $scope.isEdit_Comment = false;
    $scope.isEditTexts = "编辑";
    $http.get('http://127.0.0.1:5000/api/v1/literatures/settings')
        .success(function (data) {
            $scope.literatureTypes = data.literatureTypes
            $scope.typeSelected=$scope.literatureTypes[0]
            $scope.allFields = data.fields
            $scope.newLiteratureTypes = []

            $http.get('http://127.0.0.1:5000/api/v1/settings')
                .success(function (data) {
                    $scope.configData = data;
                    //文献配置部分
                    $scope.literatureFields = {}
                    $scope.Selected = {}

                    $scope.literatureTypes.forEach(function (Type) {
                        $scope.literatureFields[Type.name] = data[Type.name]
                        $scope.Selected[Type.name] = []
                    })

                    $scope.allFields.forEach(function (element) {
                        $scope.literatureTypes.forEach(function (inner) {
                            $scope.literatureFields[inner.name].forEach(function (field) {
                                if(element==field)
                                $scope.Selected[inner.name][element] = true;
                            })
                        })
                    })

                    //评论配置部分
                    $http.get('http://127.0.0.1:5000/api/v1/commentSettings')
                        .success(function (data) {
                            $scope.commentFields = data;
                            $scope.commentFields.forEach(function (element) {
                                $scope.configData['commentFieldsIds'].forEach(function (inner) {
                                    if(element.id == inner)
                                        element.selected = true;
                                });

                            });
                        })
                })
        })

    $scope.saveChange = function () {
        var settingsChanged = []

        $scope.literatureTypes.forEach(function (Ltype) {
            settingsChanged[Ltype.name]=[]
        })

        $scope.allFields.forEach(function (element) {
            $scope.literatureTypes.forEach(function (Ltype) {
                if($scope.Selected[Ltype.name][element])
                {
                    settingsChanged[Ltype.name].push(element)
                }
            });
        })

        $scope.literatureTypes.forEach(function (element) {
            $scope.configData[element.name] = settingsChanged[element.name]
        })

        //
        //var confFields = []
        //$scope.allFields.forEach(function (element) {
        //    if($scope.Selected['会议'][element])
        //        confFields.push(element);
        //});
        //$scope.configData['confFields'] =confFields;
        //
        //var journalFields = [];
        //$scope.allFields.forEach(function (element) {
        //    if($scope.Selected['期刊'][element])
        //        journalFields.push(element);
        //});
        //
        //$scope.configData['confFields'] = confFields;
        //$scope.configData['journalFields'] = journalFields;
        var newSetting = {"newSetting":$scope.configData,"newLiteratureTypes":$scope.newLiteratureTypes}

        $http.post('http://127.0.0.1:5000/api/v1/settings',newSetting)
            .success(function (data) {
                if(data=='success')
                alert("保存配置成功！")
                else
                alert("保存配置失败")
            })
    }

    $scope.addLiteratureType = function () {
        $scope.literatureTypes.forEach(function (element) {
            if (element.name == $scope.literatureTypeAdded)
            {
                alert("不可重复添加")
                return;
            }
        })

        $scope.Selected[$scope.literatureTypeAdded]=[]
        $scope.literatureFields[$scope.literatureTypeAdded] = []
        $scope.literatureTypes.push({"type_id":1,"name":$scope.literatureTypeAdded})
        $scope.newLiteratureTypes.push({"type_id":1,"name":$scope.literatureTypeAdded})
        $scope.typeSelected = $scope.literatureTypes[$scope.literatureTypes.length-1]
        alert("添加类型成功！")
    }

    $scope.deleteLiteratureType = function () {
        alert("外键太多不好删除...")

        //$http.delete("http://127.0.0.1:5000/api/v1/types/"+$scope.typeSelected.id)
        //    .success(function (data) {
        //        $scope.configData[$scope.typeSelected.name] = null;
        //        $http.post('http://127.0.0.1:5000/api/v1/commentSettings',{"newSetting":$scope.configData});
        //        for(var i =0;i<$scope.literatureTypes.length;i++)
        //            if($scope.literatureTypes[i].name==$scope.typeSelected.name)
        //                $scope.literatureTypes.splice(i,1);
        //    });
    }

    $scope.saveCommentChanges = function () {
        var commentChanges = []

        $scope.commentFields.forEach(function (element) {
            if(element.selected)
                commentChanges.push(element.id);
        });

        $scope.configData['commentFieldsIds'] = commentChanges;
        $http.post('http://127.0.0.1:5000/api/v1/commentSettings',{"newSetting":$scope.configData})
            .success(function (data) {
                if(data=='success')
                    alert("保存配置成功！")
                else
                    alert("保存配置失败")
            })

    }

    $scope.addCommentField = function () {
        var commentFieldAdded = {"type":2,"name":$scope.commentFieldNameAdded}
        $http.post("http://127.0.0.1:5000/api/v1/attributes",commentFieldAdded)
            .success(function (data) {
                $scope.commentFields.push(data);
            })
    }

    $scope.editComment = function () {
        if(!$scope.isEdit_Comment)
        {
            $scope.isEditTexts = "保存"

        }else
        {
            $scope.commentFields.forEach(function (element) {
                $http.put("http://127.0.0.1:5000/api/v1/attributes/"+element.id,element)
            });
            $scope.isEditTexts = "编辑"
        }
        $scope.isEdit_Comment= !$scope.isEdit_Comment;
    }

    $scope.deleteCommentField = function () {
        for(var i = 0;i<$scope.commentFields.length;i++)
        {
            if($scope.commentFields[i].selected)
            {
                $http.delete("http://127.0.0.1:5000/api/v1/attributes/"+$scope.commentFields[i].id);
                $scope.commentFields.splice(i,1);
            }
        }
    }


    //$scope.commentFieldsIds =
    //    = $scope.configData['commentFieldsIds'];



}])

